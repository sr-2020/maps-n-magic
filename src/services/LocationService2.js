import * as R from 'ramda';

import { AbstractService } from './AbstractService';

export class LocationService2 extends AbstractService {
  metadata = {
    actions: [
      'postLocation2',
      'deleteLocation2',
      'putLocation2',
      'postLocation2Confirmed',
      'deleteLocation2Confirmed',
      'putLocation2Confirmed',
      'setLocations2',
    ],
    requests: ['locations2'],
    emitEvents: [
      'postLocation2',
      'deleteLocation2',
      'putLocation2',
      'postLocation2Requested',
      'deleteLocation2Requested',
      'putLocation2Requested',
      'locations2Changed',
    ],
    listenEvents: [],
  };

  constructor() {
    super();
    this.locations2 = [];
  }

  setData({ locations2 } = {}) {
    this.locations2 = locations2 || [];
  }

  getData() {
    return {
      locations2: this.getLocations2(),
    };
  }

  getLocations2() {
    return [...this.locations2];
  }

  setLocations2({ locations2 }) {
    this.locations2 = locations2;
    this.emit('locations2Changed', {
      locations2,
    });
  }

  putLocation2({ id, props }) {
    this.emit('putLocation2Requested', { id, props });
  }

  postLocation2 = ({ props }) => {
    this.emit('postLocation2Requested', { props });
  }

  deleteLocation2 = ({ id }) => {
    this.emit('deleteLocation2Requested', { id });
  }

  putLocation2Confirmed({ location2 }) {
    const index = this.locations2.findIndex((br) => br.id === location2.id);
    this.locations2[index] = location2;
    this.emit('putLocation2', { location2 });
  }

  deleteLocation2Confirmed({ location2 }) {
    this.locations2 = this.locations2.filter((br) => br.id !== location2.id);
    this.emit('deleteLocation2', { location2 });
  }

  postLocation2Confirmed({ location2 }) {
    this.locations2.push(location2);
    // console.log('postBeaconRecord');
    this.emit('postLocation2', { location2 });
  }
}
