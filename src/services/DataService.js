import * as R from 'ramda';
import { getBeacons2 } from '../data/beacons';
import { getBoundingRect, scaleRect } from '../utils/polygonUtils';

import { baseCommonLLs } from '../data/baseContours';
import { initialLocations } from '../data/locations';

import { getPolygons2 } from '../utils/polygonGenerator';
import { getEeStats } from '../utils/miscUtils';

export class DataService {
  constructor({ beacons, locations } = {}) {
    // this.beacons = beacons || this._getLSBeacons() || getBeacons2();
    this.beacons = beacons || getBeacons2();
    this.maxBeaconId = R.reduce(R.max, 1, this.beacons.map(R.prop('id')));
    // this.locations = locations || this._getLSLocations() || initialLocations;
    this.locations = locations || initialLocations;
    this.locations.forEach((location) => {
      if (!location.manaLevel) {
        location.manaLevel = 'normal';
      }
    });
    this.maxLocationId = R.reduce(R.max, 1, this.locations.map(R.prop('id')));
    if (beacons) {
      this._saveBeacons();
    }
    if (locations) {
      this._saveLocations();
    }
  }

  // _getLSBeacons = function () {
  //   const beacons = localStorage.getItem('beacons');
  //   return beacons ? JSON.parse(beacons) : null;
  // }

  // _getLSLocations = function () {
  //   const locations = localStorage.getItem('locations');
  //   return locations ? JSON.parse(locations) : null;
  // }

  getBeacons = function () {
    return this.beacons;
  }

  putBeacon = (id, props) => {
    const index = this.beacons.findIndex((beacon) => beacon.id === id);
    this.beacons[index] = {
      ...this.beacons[index],
      ...props,
      id,
    };
    this._saveBeacons();
  }

  postBeacon = (props) => {
    this.maxBeaconId++;
    this.beacons.push({
      ...props,
      id: this.maxBeaconId,
      name: String(this.maxBeaconId),
    });
    this._saveBeacons();
    return this.beacons[this.beacons.length - 1];
  }

  deleteBeacon = (id) => {
    this.beacons = this.beacons.filter((beacon) => beacon.id !== id);
    this._saveBeacons();
  }

  _saveBeacons = function () {
    // localStorage.setItem('beacons', JSON.stringify(this.beacons));
  }

  getLocations = function () {
    return this.locations;
  }

  putLocation = (id, props) => {
    const index = this.locations.findIndex((loc) => loc.id === id);
    this.locations[index] = {
      ...this.locations[index],
      ...props,
      id,
    };
    this._saveLocations();
  }

  postLocation = (props) => {
    this.maxLocationId++;
    this.locations.push({
      ...props,
      markers: [],
      manaLevel: 'normal',
      id: this.maxLocationId,
      name: String(this.maxLocationId),
    });
    this._saveLocations();
    return this.locations[this.locations.length - 1];
  }

  deleteLocation = (id) => {
    this.locations = this.locations.filter((loc) => loc.id !== id);
    this._saveLocations();
  }

  _saveLocations = function () {
    // localStorage.setItem('locations', JSON.stringify(this.locations));
  }

  getAttachedBeaconIds = () => {
    const allArrs = this.locations.map((loc) => loc.markers);
    return R.uniq(R.flatten(allArrs));
  }

  getVoronoiPolygonData = () => {
    const bRect1 = (getBoundingRect(baseCommonLLs));
    const bRect = scaleRect(bRect1, 1.1);
    const boundingPolylineData = this._boundingRect2Polyline(bRect);

    const plainPoints = this.getBeacons().map((beacon) => ({
      x: beacon.lat,
      y: beacon.lng,
    }));
    // console.log('plainPoints', plainPoints);
    const polygonData = getPolygons2(plainPoints,
      [bRect.bottom, bRect.left, bRect.top, bRect.right],
      // , null);
      baseCommonLLs);

    return { boundingPolylineData, polygonData };
  }

  _boundingRect2Polyline = (bRect) => [
    [bRect.top, bRect.left],
    [bRect.top, bRect.right],
    [bRect.bottom, bRect.right],
    [bRect.bottom, bRect.left],
    [bRect.top, bRect.left],
  ];

  // on(...args) {
  //   const res = super.on.apply(this, args);
  //   console.log('on', getEeStats(this));
  //   return res;
  // }

  // off(...args) {
  //   const res = super.off.apply(this, args);
  //   console.log('off', getEeStats(this));
  //   return res;
  // }
}
