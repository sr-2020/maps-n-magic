import * as R from 'ramda';
// import { getBeacons2 } from '../data/beacons';
// import { getBoundingRect, scaleRect } from '../utils/polygonUtils';

// import { baseCommonLLs } from '../data/baseContours';

// import { getPolygons2 } from '../utils/polygonGenerator';

const defaultSpirit = {

};

export class SpiritService {
  constructor({ spirits } = {}) {
    this.spirits = spirits || this._getLSSpirits() || [];
    this.maxSpiritId = R.reduce(R.max, 1, this.spirits.map(R.prop('id')));
    if (spirits) {
      this._saveSpirits();
    }
  }

  _getLSSpirits = function () {
    const spirits = localStorage.getItem('spirits');
    return spirits ? JSON.parse(spirits) : null;
  }

  getSpirits = function () {
    return this.spirits;
  }

  putSpirit = (id, props) => {
    const index = this.spirits.findIndex((spirit) => spirit.id === id);
    this.spirits[index] = {
      ...this.spirits[index],
      ...props,
      id,
    };
    this._saveSpirits();
  }

  postSpirit = (props) => {
    this.maxSpiritId++;
    this.spirits.push({
      // ...default
      ...props,
      id: this.maxSpiritId,
      name: String(this.maxSpiritId),
    });
    this._saveSpirits();
    return this.spirits[this.spirits.length - 1];
  }

  deleteSpirit = (id) => {
    this.spirits = this.spirits.filter((spirit) => spirit.id !== id);
    this._saveSpirits();
  }

  _saveSpirits = function () {
    localStorage.setItem('spirits', JSON.stringify(this.spirits));
  }

  // getLocations = function () {
  //   return this.locations;
  // }

  // putLocation = (id, props) => {
  //   const index = this.locations.findIndex((loc) => loc.id === id);
  //   this.locations[index] = {
  //     ...this.locations[index],
  //     ...props,
  //     id,
  //   };
  //   this._saveLocations();
  // }

  // postLocation = (props) => {
  //   this.maxLocationId++;
  //   this.locations.push({
  //     ...props,
  //     markers: [],
  //     id: this.maxLocationId,
  //     name: String(this.maxLocationId),
  //   });
  //   this._saveLocations();
  //   return this.locations[this.locations.length - 1];
  // }

  // deleteLocation = (id) => {
  //   this.locations = this.locations.filter((loc) => loc.id !== id);
  //   this._saveLocations();
  // }

  // _saveLocations = function () {
  //   localStorage.setItem('locations', JSON.stringify(this.locations));
  // }

  // getAttachedBeaconIds = () => {
  //   const allArrs = this.locations.map((loc) => loc.markers);
  //   return R.uniq(R.flatten(allArrs));
  // }

  // getVoronoiPolygonData = () => {
  //   const bRect1 = (getBoundingRect(baseCommonLLs));
  //   const bRect = scaleRect(bRect1, 1.1);
  //   const boundingPolylineData = this._boundingRect2Polyline(bRect);

  //   const plainPoints = this.getBeacons().map((beacon) => ({
  //     x: beacon.lat,
  //     y: beacon.lng,
  //   }));
  //   // console.log('plainPoints', plainPoints);
  //   const polygonData = getPolygons2(plainPoints,
  //     [bRect.bottom, bRect.left, bRect.top, bRect.right],
  //     // , null);
  //     baseCommonLLs);

  //   return { boundingPolylineData, polygonData };
  // }

  // _boundingRect2Polyline = (bRect) => [
  //   [bRect.top, bRect.left],
  //   [bRect.top, bRect.right],
  //   [bRect.bottom, bRect.right],
  //   [bRect.bottom, bRect.left],
  //   [bRect.top, bRect.left],
  // ];
}
