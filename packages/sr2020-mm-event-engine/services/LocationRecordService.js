import * as R from 'ramda';

import { AbstractService } from '../core/AbstractService';

// duplicated in LocationHolder
const defaultStyleOptions = {
  color: '#3388ff',
  weight: 3,
  fillOpacity: 0.2,
};

export class LocationRecordService extends AbstractService {
  metadata = {
    actions: [
      'postLocationRecord',
      'deleteLocationRecord',
      'putLocationRecord',
      'putLocationRecords',
      'postLocationRecordConfirmed',
      'deleteLocationRecordConfirmed',
      'putLocationRecordConfirmed',
      'putLocationRecordsConfirmed',
      'setLocationRecords',
    ],
    requests: ['locationRecord', 'locationRecords'],
    emitEvents: [
      'postLocationRecord',
      'deleteLocationRecord',
      'putLocationRecord',
      'putLocationRecords',
      'postLocationRecordRequested',
      'deleteLocationRecordRequested',
      'putLocationRecordRequested',
      'putLocationRecordsRequested',
      'locationRecordsChanged',
      'locationRecordsChanged2',
    ],
    listenEvents: [],
  };

  constructor() {
    super();
    this.locationRecords = [];
  }

  setData({ locationRecords } = {}) {
    this.locationRecords = locationRecords || [];
    this.locationRecords.forEach((loc) => {
      loc.options = {
        ...defaultStyleOptions,
        ...loc.options,
      };
    });
  }

  getData() {
    return {
      locationRecords: this.getLocationRecords(),
    };
  }

  getLocationRecords() {
    return [...this.locationRecords];
  }

  getLocationRecord({ id }) {
    const locationRecord = this.locationRecords.find((br) => br.id === id);
    if (locationRecord === undefined) {
      console.error('location record not found, locaitonId', id);
    }
    return R.clone(locationRecord);
  }

  setLocationRecords({ locationRecords }) {
    this.setData({ locationRecords });
    // this.locationRecords = locationRecords;
    this.emit('locationRecordsChanged', {
      locationRecords,
    });
    this.emit('locationRecordsChanged2', {
      type: 'locationRecordsChanged2',
      locationRecords,
    });
  }

  putLocationRecord(action) {
    this.emit('putLocationRecordRequested', action);
  }

  putLocationRecords(action) {
    this.emit('putLocationRecordsRequested', action);
  }

  postLocationRecord = (action) => {
    this.emit('postLocationRecordRequested', action);
  }

  deleteLocationRecord = (action) => {
    this.emit('deleteLocationRecordRequested', action);
  }

  putLocationRecordConfirmed({ locationRecord }) {
    const index = this.locationRecords.findIndex((br) => br.id === locationRecord.id);
    this.locationRecords = [...this.locationRecords];
    this.locationRecords[index] = locationRecord;
    this.emit('putLocationRecord', { locationRecord });
    this.emit('locationRecordsChanged2', {
      type: 'locationRecordsChanged2',
      locationRecords: this.locationRecords,
    });
  }

  putLocationRecordsConfirmed({ locationRecords }) {
    console.log(locationRecords);
    // locationRecords.forEach((locationRecord) => {
    //   const index = this.locationRecords.findIndex((br) => br.id === locationRecord.id);
    //   this.locationRecords[index] = locationRecord;
    // });
    // this.emit('putLocationRecords', { locationRecords });
  }

  deleteLocationRecordConfirmed({ locationRecord }) {
    this.locationRecords = this.locationRecords.filter((br) => br.id !== locationRecord.id);
    this.emit('deleteLocationRecord', { locationRecord });
    this.emit('locationRecordsChanged2', {
      type: 'locationRecordsChanged2',
      locationRecords: this.locationRecords,
    });
  }

  postLocationRecordConfirmed({ locationRecord }) {
    this.locationRecords = [...this.locationRecords, locationRecord];
    // console.log('postBeaconRecord');
    this.emit('postLocationRecord', { locationRecord });
    this.emit('locationRecordsChanged2', {
      type: 'locationRecordsChanged2',
      locationRecords: this.locationRecords,
    });
  }
}
