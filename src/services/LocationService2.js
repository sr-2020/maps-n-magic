import * as R from 'ramda';

import { AbstractService } from './AbstractService';

export class LocationService2 extends AbstractService {
  metadata = {
    actions: [
      'postLocationRecord',
      'deleteLocationRecord',
      'putLocationRecord',
      'postLocationRecordConfirmed',
      'deleteLocationRecordConfirmed',
      'putLocationRecordConfirmed',
      'setLocationRecords',
    ],
    requests: ['locationRecords'],
    emitEvents: [
      'postLocationRecord',
      'deleteLocationRecord',
      'putLocationRecord',
      'postLocationRecordRequested',
      'deleteLocationRecordRequested',
      'putLocationRecordRequested',
      'locationRecordsChanged',
    ],
    listenEvents: [],
  };

  constructor() {
    super();
    this.locationRecords = [];
  }

  setData({ locationRecords } = {}) {
    this.locationRecords = locationRecords || [];
  }

  getData() {
    return {
      locationRecords: this.getLocationRecords(),
    };
  }

  getLocationRecords() {
    return [...this.locationRecords];
  }

  setLocationRecords({ locationRecords }) {
    this.locationRecords = locationRecords;
    this.emit('locationRecordsChanged', {
      locationRecords,
    });
  }

  putLocationRecord({ id, props }) {
    this.emit('putLocationRecordRequested', { id, props });
  }

  postLocationRecord = ({ props }) => {
    this.emit('postLocationRecordRequested', { props });
  }

  deleteLocationRecord = ({ id }) => {
    this.emit('deleteLocationRecordRequested', { id });
  }

  putLocationRecordConfirmed({ location2 }) {
    const index = this.locationRecords.findIndex((br) => br.id === location2.id);
    this.locationRecords[index] = location2;
    this.emit('putLocationRecord', { location2 });
  }

  deleteLocationRecordConfirmed({ location2 }) {
    this.locationRecords = this.locationRecords.filter((br) => br.id !== location2.id);
    this.emit('deleteLocationRecord', { location2 });
  }

  postLocationRecordConfirmed({ location2 }) {
    this.locationRecords.push(location2);
    // console.log('postBeaconRecord');
    this.emit('postLocationRecord', { location2 });
  }
}
