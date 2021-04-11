import * as R from 'ramda';
import type { 
  Geometry, 
  Feature,
  Polygon,
  Point,
  LineString
} from 'geojson';
import type { 
  LatLngExpression,
  LatLngLiteral,
  LatLngTuple,
  LatLng
} from "leaflet";

// export interface LatLngLiteral {
//   lat: number;
//   lng: number;
// }

// export type LatLngTuple = [number, number];

// export type LatLngExpression = LatLng | LatLngLiteral | LatLngTuple;

// function isFish(pet: Fish | Bird): pet is Fish {
//   return (pet as Fish).swim !== undefined;
// }

// type LocalLatLng = {lat: number, lng: number};
// type LocalPoint = [number, number];
type LocalLocation = {latlngs: [LatLngLiteral[]]};
type LocalPolygon = LatLng[] | LatLngTuple[] | LatLngLiteral[];
type LocalCompositePolygon = LocalPolygon[][];

type TranslatableElement = LatLngLiteral |
  LatLngTuple |
  LocalLocation |
  LocalPolygon |
  LocalCompositePolygon;

type op = (a: number, b: number) => number;

const _isPoint = (el: any) => R.is(Object, el) && !!el[0] && !!el[1];

const _isLatlng = (el: any) => R.is(Object, el) && !!el.lat && !!el.lng;

const _isBeacon = (obj: any) => R.is(Object, obj) && obj.lat && obj.lng;

const _isLocation = (obj: any) => R.is(Object, obj) && obj.latlngs;

const _isPolygon = (obj: any) => R.is(Object, obj) && R.is(Object, obj[0]);

const _isCompositePolygon = (obj: any) => R.is(Object, obj) && R.is(Object, obj[0]) && R.is(Object, obj[0][0]);

export class Translator {
  deltaLat: number;
  deltaLng: number;

  constructor(
    private defaultCenter: [number, number], // [lat, lng]
    private virtualCenter: [number, number] | null  // [lat, lng]
  ) {
    if (this.virtualCenter !== null) {
      this.deltaLat = this.virtualCenter[0] - this.defaultCenter[0];
      this.deltaLng = this.virtualCenter[1] - this.defaultCenter[1];
    }

    this.moveTo = this.moveTo.bind(this);
    this.moveFrom = this.moveFrom.bind(this);
  }

  getDefaultCenter() {
    return this.defaultCenter;
  }

  getVirtualCenter(): [number, number] | null {
    return this.virtualCenter;
  }

  private _move<T extends TranslatableElement>(obj: T, func: op): T {
    if (this.virtualCenter === null) {
      return obj;
    }
    if (_isBeacon(obj)) { // beacon
      // @ts-ignore
      return this._moveBeacon(obj as LocalLatLng, func);
    }
    if (_isLocation(obj)) { // location
      // @ts-ignore
      return this._moveLocation(obj as LocalLocation, func);
    }
    // composite polygon, like from Voronoi intersections
    if (_isCompositePolygon(obj)) {
      // @ts-ignore
      return this._moveVoronoiPolygon(obj as LocalCompositePolygon, func);
    }
    if (_isPolygon(obj)) { // contour case
      // @ts-ignore
      return this._movePolygon(obj as LocalPolygon, func);
    }
    if (R.is(Object, obj)) { // point
      // @ts-ignore
      return this._movePoint(obj as LocalPoint, func);
    }
    return obj;
  }



  _moveBeacon(beacon: LatLngLiteral, func: op): LatLngLiteral {
    return {
      ...beacon,
      lat: func(beacon.lat, this.deltaLat),
      lng: func(beacon.lng, this.deltaLng),
    };
  }

  _moveLocation(location: LocalLocation, func: op): LocalLocation {
    return {
      ...location,
      latlngs: [
        location.latlngs[0].map((el) => ({
          lat: func(el.lat, this.deltaLat),
          lng: func(el.lng, this.deltaLng),
        })),
      ],
    };
  }

  _moveVoronoiPolygon(level1: LocalCompositePolygon, func: op): LocalCompositePolygon {
    return level1.map((level2) => level2.map((polygon) => this._movePolygon(polygon, func)));
  }

  _movePolygon(polygon: LocalPolygon, func: op): LocalPolygon {
    if (polygon.length === 0) {
      return [];
    }
    if(_isPoint(polygon[0])) {
      return (polygon as LatLngTuple[]).map((point) => this._movePoint(point, func));
    } else {
      return (polygon as LatLngLiteral[]).map((point) => this._moveBeacon(point, func));
    }
    // return polygon.map((point) => (this._isPoint(point) ? this._movePoint(point, func) : this._moveBeacon(point, func)));
    // return polygon.map((point) => (_isPoint(point) ? 
    //   this._movePoint(point as LatLngTuple, func) : 
    //   this._moveBeacon(point as LatLngLiteral, func)
    // ));
  }

  _movePoint(point: LatLngTuple, func: op): LatLngTuple {
    return [
      func(point[0], this.deltaLat),
      func(point[1], this.deltaLng),
    ];
  }

  moveTo<T extends TranslatableElement>(obj: T): T {
    return this._move(obj, R.add);
  }

  moveFrom<T extends TranslatableElement>(obj: T): T {
    return this._move(obj, R.subtract);
  }

  geoJsonMoveTo(obj: Feature): Feature {
    return this._moveGeoJson(obj, R.add);
  }

  geoJsonMoveFrom(obj: Feature): Feature {
    return this._moveGeoJson(obj, R.subtract);
  }

  private _moveGeoJson(feature: Feature, func: op): Feature {
    if (this.virtualCenter === null) {
      return feature;
    }
    if (feature.geometry.type === 'Polygon') {
      const clone = R.clone(feature);
      clone.geometry = this._moveGeoJsonPolygon(feature.geometry as Polygon, func);
      return clone;
    }
    if (feature.geometry.type === 'Point') {
      const clone = R.clone(feature);
      clone.geometry = this._moveGeoJsonPoint(feature.geometry as Point, func);
      return clone;
    }
    if (feature.geometry.type === 'LineString') {
      const clone = R.clone(feature);
      clone.geometry = this._moveGeoJsonLineString(feature.geometry as LineString, func);
      return clone;
    }
    return feature;
  }

  private _moveGeoJsonPolygon(geometry: Polygon, func: op): Polygon {
    const clone = R.clone(geometry);

    clone.coordinates[0] = clone.coordinates[0].map((el) => ([
      func(el[0], this.deltaLng),
      func(el[1], this.deltaLat),
      el[2],
    ]));
    return clone;
  }

  private _moveGeoJsonLineString(geometry: LineString, func: op): LineString {
    const clone = R.clone(geometry);

    clone.coordinates = clone.coordinates.map((el) => ([
      func(el[0], this.deltaLng),
      func(el[1], this.deltaLat),
      el[2],
    ]));
    return clone;
  }

  private _moveGeoJsonPoint(geometry: Point, func: op): Point {
    const clone = R.clone(geometry);
    const { coordinates } = clone;

    clone.coordinates = [
      func(coordinates[0], this.deltaLng),
      func(coordinates[1], this.deltaLat),
      coordinates[2],
    ];
    return clone;
  }
}
