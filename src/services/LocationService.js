import * as R from 'ramda';

import { initialLocations } from '../data/locations';

import { AbstractService } from './AbstractService';

export class LocationService extends AbstractService {
  metadata = {
    actions: ['postLocation', 'deleteLocation', 'putLocation'],
    requests: ['locations', 'attachedBeaconIds'],
    emitEvents: [],
    listenEvents: [],
  };

  constructor() {
    super();
    this.locations = initialLocations;
    this.locations.forEach((location) => {
      if (!location.manaLevel) {
        location.manaLevel = 'normal';
      }
    });
    this.maxLocationId = 1;
  }

  setData({ locations } = {}) {
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
      locations: this._getLocations(),
    };
  }

  execute(action, onDefaultAction) {
    if (action.type === 'putLocation') {
      return this._putLocation(action);
    }
    if (action.type === 'postLocation') {
      return this._postLocation(action);
    }
    if (action.type === 'deleteLocation') {
      return this._deleteLocation(action);
    }
    return onDefaultAction(action);
  }

  get(request, onDefaultRequest) {
    if (request.type === 'locations') {
      return this._getLocations(request);
    }
    if (request.type === 'attachedBeaconIds') {
      return this._getAttachedBeaconIds(request);
    }
    return onDefaultRequest(request);
  }

  _getLocations() {
    return this.locations;
  }

  _putLocation({ id, props }) {
    const index = this.locations.findIndex((loc) => loc.id === id);
    this.locations[index] = {
      ...this.locations[index],
      ...props,
      id,
    };
  }

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

  _deleteLocation({ id }) {
    this.locations = this.locations.filter((loc) => loc.id !== id);
  }

  _getAttachedBeaconIds() {
    const allArrs = this.locations.map((loc) => loc.markers);
    return R.uniq(R.flatten(allArrs));
  }

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
