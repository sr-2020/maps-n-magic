import * as R from 'ramda';
import { getBeacons2 } from '../../data/beacons';
import { getBoundingRect, scaleRect } from '../../utils/polygonUtils';

import { baseCommonLLs } from '../../data/baseContours';

import { getPolygons2 } from '../../utils/polygonGenerator';
import { getEeStats } from '../../utils/miscUtils';

import { AbstractService } from '../core/AbstractService';

export class BeaconService extends AbstractService {
  metadata = {
    actions: ['postBeacon', 'deleteBeacon', 'putBeacon'],
    requests: ['beacons', 'voronoiPolygonData'],
    emitEvents: ['postBeacon', 'deleteBeacon', 'putBeacon'],
    listenEvents: [],
  };

  constructor() {
    super();
    this.beacons = getBeacons2();
    this.maxBeaconId = 1;
  }

  setData({ beacons } = {}) {
    this.beacons = beacons || getBeacons2();
    this.maxBeaconId = R.reduce(R.max, 1, this.beacons.map(R.prop('id')));
  }

  getData() {
    return {
      beacons: this.getBeacons(),
    };
  }

  getBeacons() {
    return this.beacons;
  }

  putBeacon({ id, props }) {
    const index = this.beacons.findIndex((beacon) => beacon.id === id);
    this.beacons[index] = {
      ...this.beacons[index],
      ...props,
      id,
    };
    const beacon = this.beacons[index];
    this.emit('putBeacon', { beacon });
    return beacon;
  }

  postBeacon = ({ props }) => {
    this.maxBeaconId++;
    this.beacons.push({
      ...props,
      id: this.maxBeaconId,
      name: String(this.maxBeaconId),
    });
    const beacon = this.beacons[this.beacons.length - 1];
    this.emit('postBeacon', { beacon });
    return beacon;
  }

  deleteBeacon = ({ id }) => {
    const index = this.beacons.findIndex((beacon) => beacon.id === id);
    const beacon = this.beacons[index];
    this.beacons = R.remove(index, 1, this.beacons);
    this.emit('deleteBeacon', { beacon });
    return beacon;
  }

  getVoronoiPolygonData() {
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
