import * as R from 'ramda';
import { getBeacons2 } from '../data/beacons';
import { getBoundingRect, scaleRect } from '../utils/polygonUtils';

import { baseCommonLLs } from '../data/baseContours';
import { initialLocations } from '../data/locations';

import { getPolygons2 } from '../utils/polygonGenerator';
import { getEeStats } from '../utils/miscUtils';

import { AbstractService } from './AbstractService';

function stringToType(entity) {
  return R.is(String, entity) ? {
    type: entity,
  } : entity;
}

export class DataService extends AbstractService {
  metadata = {
    actions: ['postLocation', 'deleteLocation', 'putLocation', 'postBeacon', 'deleteBeacon', 'putBeacon'],
    requests: ['beacons', 'locations', 'attachedBeaconIds', 'voronoiPolygonData'],
    emitEvents: [],
    listenEvents: [],
  };

  constructor() {
    super();
    this.beacons = getBeacons2();
    this.maxBeaconId = 1;
    this.locations = initialLocations;
    this.locations.forEach((location) => {
      if (!location.manaLevel) {
        location.manaLevel = 'normal';
      }
    });
    this.maxLocationId = 1;
  }

  setData({ beacons, locations } = {}) {
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
  }

  getData() {
    return {
      beacons: this._getBeacons(),
      locations: this._getLocations(),
    };
  }

  execute(action, onDefaultAction) {
    action = stringToType(action);
    if (action.type === 'putLocation') {
      return this._putLocation(action);
    }
    if (action.type === 'postLocation') {
      return this._postLocation(action);
    }
    if (action.type === 'deleteLocation') {
      return this._deleteLocation(action);
    }
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
    if (request.type === 'locations') {
      return this._getLocations(request);
    }
    if (request.type === 'attachedBeaconIds') {
      return this._getAttachedBeaconIds(request);
    }
    if (request.type === 'voronoiPolygonData') {
      return this._getVoronoiPolygonData(request);
    }
    return onDefaultRequest(request);
  }

  _getBeacons() {
    return this.beacons;
  }

  // getBeacons = function () {
  //   return this._getBeacons();
  // }

  _getLocations() {
    return this.locations;
  }

  // getLocations = function () {
  //   return this._getLocations();
  // }

  _putBeacon({ id, props }) {
    const index = this.beacons.findIndex((beacon) => beacon.id === id);
    this.beacons[index] = {
      ...this.beacons[index],
      ...props,
      id,
    };
  }

  // putBeacon = (id, props) => this._putBeacon({ id, props })

  _postBeacon = ({ props }) => {
    this.maxBeaconId++;
    this.beacons.push({
      ...props,
      id: this.maxBeaconId,
      name: String(this.maxBeaconId),
    });

    return this.beacons[this.beacons.length - 1];
  }

  // postBeacon = (props) => this._postBeacon({ props })

  _deleteBeacon = ({ id }) => {
    this.beacons = this.beacons.filter((beacon) => beacon.id !== id);
  }

  // deleteBeacon = (id) => this._deleteBeacon({ id })

  _putLocation({ id, props }) {
    const index = this.locations.findIndex((loc) => loc.id === id);
    this.locations[index] = {
      ...this.locations[index],
      ...props,
      id,
    };
  }

  // putLocation = (id, props) => this._putLocation({ id, props })

  _postLocation({ props }) {
    this.maxLocationId++;
    this.locations.push({
      ...props,
      markers: [],
      manaLevel: 'normal',
      id: this.maxLocationId,
      name: String(this.maxLocationId),
    });

    return this.locations[this.locations.length - 1];
  }

  // postLocation = (props) => this._postLocation({ props })

  _deleteLocation({ id }) {
    this.locations = this.locations.filter((loc) => loc.id !== id);
  }

  // deleteLocation = (id) => this._deleteLocation({ id })

  _getAttachedBeaconIds() {
    const allArrs = this.locations.map((loc) => loc.markers);
    return R.uniq(R.flatten(allArrs));
  }

  // getAttachedBeaconIds = () => this._getAttachedBeaconIds()

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

  // getVoronoiPolygonData = () => this._getVoronoiPolygonData()

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
