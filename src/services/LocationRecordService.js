import * as R from 'ramda';

import { AbstractService } from './AbstractService';

export class LocationRecordService extends AbstractService {
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

  putLocationRecordConfirmed({ locationRecord }) {
    const index = this.locationRecords.findIndex((br) => br.id === locationRecord.id);
    this.locationRecords[index] = locationRecord;
    this.emit('putLocationRecord', { locationRecord });
  }

  deleteLocationRecordConfirmed({ locationRecord }) {
    this.locationRecords = this.locationRecords.filter((br) => br.id !== locationRecord.id);
    this.emit('deleteLocationRecord', { locationRecord });
  }

  postLocationRecordConfirmed({ locationRecord }) {
    this.locationRecords.push(locationRecord);
    // console.log('postBeaconRecord');
    this.emit('postLocationRecord', { locationRecord });
  }
}
