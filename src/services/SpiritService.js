import * as R from 'ramda';
import EventEmitter from 'events';
// import { getBeacons2 } from '../data/beacons';
// import { getBoundingRect, scaleRect } from '../utils/polygonUtils';

// import { baseCommonLLs } from '../data/baseContours';

// import { getPolygons2 } from '../utils/polygonGenerator';


import { defaultSpirit } from '../types/primitives';

export class SpiritService extends EventEmitter {
  constructor({ spirits } = {}) {
    super();
    this.spirits = spirits || this._getLSSpirits() || [];
    this.maxSpiritId = R.reduce(R.max, 1, this.spirits.map(R.prop('id')));
    if (this.spirits.length === 0) {
      ['Иркут', 'Ангара', 'Байкал', 'Баргузин'].forEach((name) => this.postSpirit({ name }));
    }
    if (spirits) {
      this._saveSpirits();
    }
    this.fractions = [];
    this.updateSpiritFractionsList();
  }

  _getLSSpirits = function () {
    const spirits = localStorage.getItem('spirits');
    return spirits ? JSON.parse(spirits) : null;
  }

  getSpirits = function () {
    return this.spirits;
  }

  getSpirit = function (id) {
    return { ...this.spirits.find((spirit) => spirit.id === id) };
  }

  putSpirit = (id, props) => {
    const index = this.spirits.findIndex((spirit) => spirit.id === id);
    this.spirits[index] = {
      ...this.spirits[index],
      ...props,
      id,
    };
    this.updateSpiritFractionsList();
    this.emit('putSpirit', R.clone(this.spirits[index]));
    this._saveSpirits();
  }

  postSpirit = (props) => {
    this.maxSpiritId++;
    this.spirits.push({
      ...R.clone(defaultSpirit),
      ...props,
      id: this.maxSpiritId,
      // name: String(this.maxSpiritId),
    });
    this._saveSpirits();
    this.updateSpiritFractionsList();
    return this.spirits[this.spirits.length - 1];
  }

  cloneSpirit = (id) => {
    const spirit = this.getSpirit(id);
    return this.postSpirit({
      ...spirit,
      name: this.makeSpiritName(spirit.name),
    });
  }

  makeSpiritName = (name) => {
    const spiritMap = R.indexBy(R.prop('name'), this.spirits);
    const base = `${name} клон`;
    let newName = base;
    let counter = 1;
    while (spiritMap[newName] != undefined) {
      newName = `${base} ${counter}`;
      counter++;
    }
    return newName;
  }

  deleteSpirit = (id) => {
    this.spirits = this.spirits.filter((spirit) => spirit.id !== id);
    this.updateSpiritFractionsList();
    this._saveSpirits();
  }

  updateSpiritFractionsList = () => {
    const newFractions = R.without([''], R.uniq(this.spirits.map(R.prop('fraction'))));
    if (this.fractions.length !== newFractions || R.symmetricDifference(newFractions, this.fractions).length > 0) {
      this.fractions = newFractions;
      this.emit('fractionChange', R.clone(this.fractions));
    }
  }

  getSpiritFractionsList = () => this.fractions;

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
