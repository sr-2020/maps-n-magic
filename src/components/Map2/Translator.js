import * as R from 'ramda';

export class Translator {
  constructor(center, userCoords) {
    this.center = center; // [lat, lng]
    this.userCoords = userCoords; // [lat, lng]
    if (userCoords) {
      this.deltaLat = this.userCoords[0] - this.center[0];
      this.deltaLng = this.userCoords[1] - this.center[1];
    }

    this.moveTo = this.moveTo.bind(this);
    this.moveFrom = this.moveFrom.bind(this);
  }

  _move(obj, func) {
    if (this.userCoords === null) {
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
    return polygon.map((point) => this._movePoint(point, func));
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

  moveFrom(obj) {
    return this._move(obj, R.subtract);
  }
}
