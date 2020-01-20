import * as R from 'ramda';
import { getBeacons2 } from '../data/beacons';
import { getBoundingRect, scaleRect } from '../utils/polygonUtils';

import { baseCommonLLs } from '../data/baseContours';

import { getPolygons2 } from '../utils/polygonGenerator';
import { getEeStats } from '../utils/miscUtils';

import { AbstractService } from './AbstractService';

function stringToType(entity) {
  return R.is(String, entity) ? {
    type: entity,
  } : entity;
}

export class BeaconService extends AbstractService {
  metadata = {
    actions: ['postBeacon', 'deleteBeacon', 'putBeacon'],
    requests: ['beacons', 'voronoiPolygonData'],
    emitEvents: [],
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
      beacons: this._getBeacons(),
    };
  }

  execute(action, onDefaultAction) {
    action = stringToType(action);
    if (action.type === 'putBeacon') {
      return this._putBeacon(action);
    }
    if (action.type === 'postBeacon') {
      return this._postBeacon(action);
    }
    if (action.type === 'deleteBeacon') {
      return this._deleteBeacon(action);
    }
    return onDefaultAction(action);
  }

  get(request, onDefaultRequest) {
    request = stringToType(request);
    if (request.type === 'beacons') {
      return this._getBeacons(request);
    }
    if (request.type === 'voronoiPolygonData') {
      return this._getVoronoiPolygonData(request);
    }
    return onDefaultRequest(request);
  }

  _getBeacons() {
    return this.beacons;
  }

  _putBeacon({ id, props }) {
    const index = this.beacons.findIndex((beacon) => beacon.id === id);
    this.beacons[index] = {
      ...this.beacons[index],
      ...props,
      id,
    };
  }

  _postBeacon = ({ props }) => {
    this.maxBeaconId++;
    this.beacons.push({
      ...props,
      id: this.maxBeaconId,
      name: String(this.maxBeaconId),
    });

    return this.beacons[this.beacons.length - 1];
  }

  _deleteBeacon = ({ id }) => {
    this.beacons = this.beacons.filter((beacon) => beacon.id !== id);
  }

  _getVoronoiPolygonData() {
    const bRect1 = (getBoundingRect(baseCommonLLs));
    const bRect = scaleRect(bRect1, 1.1);
    const boundingPolylineData = this._boundingRect2Polyline(bRect);

    const plainPoints = this._getBeacons().map((beacon) => ({
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
