import * as R from 'ramda';

export class Translator {
  defaultCenter: [number, number];
  virtualCenter: [number, number];
  deltaLat: number;
  deltaLng: number;

  constructor(defaultCenter, virtualCenter) {
    this.defaultCenter = defaultCenter; // [lat, lng]
    this.virtualCenter = virtualCenter; // [lat, lng]
    if (virtualCenter) {
      this.deltaLat = this.virtualCenter[0] - this.defaultCenter[0];
      this.deltaLng = this.virtualCenter[1] - this.defaultCenter[1];
    }

    this.moveTo = this.moveTo.bind(this);
    this.moveFrom = this.moveFrom.bind(this);
  }

  getDefaultCenter() {
    return this.defaultCenter;
  }

  getVirtualCenter() {
    return this.virtualCenter;
  }

  _move(obj, func) {
    if (this.virtualCenter === null) {
      return obj;
    }
    if (R.is(Object, obj) && obj.lat && obj.lng) { // beacon
      return this._moveBeacon(obj, func);
    }
    if (R.is(Object, obj) && obj.latlngs) { // location
      return this._moveLocation(obj, func);
    }
    // composite polygon, like from Voronoi intersections
    if (R.is(Object, obj) && R.is(Object, obj[0]) && R.is(Object, obj[0][0])) {
      return this._moveVoronoiPolygon(obj, func);
    }
    if (R.is(Object, obj) && R.is(Object, obj[0])) { // contour case
      return this._movePolygon(obj, func);
    }
    if (R.is(Object, obj)) { // point
      return this._movePoint(obj, func);
    }
    return obj;
  }

  _isPoint = (el) => R.is(Object, el) && !!el[0] && !!el[1];

  _isLatlng = (el) => R.is(Object, el) && !!el.lat && !!el.lng;

  _moveBeacon(beacon, func) {
    return {
      ...beacon,
      lat: func(beacon.lat, this.deltaLat),
      lng: func(beacon.lng, this.deltaLng),
    };
  }

  _moveLocation(location, func) {
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

  _moveVoronoiPolygon(level1, func) {
    return level1.map((level2) => level2.map((polygon) => this._movePolygon(polygon, func)));
  }

  _movePolygon(polygon, func) {
    // return polygon.map((point) => (this._isPoint(point) ? this._movePoint(point, func) : this._moveBeacon(point, func)));
    return polygon.map((point) => (this._isPoint(point) ? this._movePoint(point, func) : this._moveBeacon(point, func)));
  }

  _movePoint(point, func) {
    return [
      func(point[0], this.deltaLat),
      func(point[1], this.deltaLng),
    ];
  }

  moveTo(obj) {
    return this._move(obj, R.add);
  }

  moveFrom<T>(obj: T): T {
    return this._move(obj, R.subtract);
  }

  geoJsonMoveTo(obj) {
    return this._moveGeoJson(obj, R.add);
  }

  geoJsonMoveFrom(obj) {
    return this._moveGeoJson(obj, R.subtract);
  }

  _moveGeoJson(feature, func) {
    if (this.virtualCenter === null) {
      return feature;
    }
    if (feature.geometry.type === 'Polygon') {
      return this._moveGeoJsonPolygon(feature, func);
    }
    if (feature.geometry.type === 'Point') {
      return this._moveGeoJsonPoint(feature, func);
    }
    if (feature.geometry.type === 'LineString') {
      return this._moveGeoJsonLineString(feature, func);
    }
    return feature;
  }

  _moveGeoJsonPolygon(feature, func) {
    const clone = R.clone(feature);

    clone.geometry.coordinates[0] = clone.geometry.coordinates[0].map((el) => ([
      func(el[0], this.deltaLng),
      func(el[1], this.deltaLat),
      el[2],
    ]));
    return clone;
  }

  _moveGeoJsonLineString(feature, func) {
    const clone = R.clone(feature);

    clone.geometry.coordinates = clone.geometry.coordinates.map((el) => ([
      func(el[0], this.deltaLng),
      func(el[1], this.deltaLat),
      el[2],
    ]));
    return clone;
  }

  _moveGeoJsonPoint(feature, func) {
    const clone = R.clone(feature);
    const { coordinates } = clone.geometry;

    clone.geometry.coordinates = [
      func(coordinates[0], this.deltaLng),
      func(coordinates[1], this.deltaLat),
      coordinates[2],
    ];
    return clone;
  }
}
