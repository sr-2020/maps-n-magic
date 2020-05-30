import * as R from 'ramda';

import { AbstractService } from './AbstractService';

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
      'postLocationRecordConfirmed',
      'deleteLocationRecordConfirmed',
      'putLocationRecordConfirmed',
      'setLocationRecords',
    ],
    requests: ['locationRecord', 'locationRecords'],
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
    return R.clone(locationRecord);
  }

  setLocationRecords({ locationRecords }) {
    this.setData({ locationRecords });
    // this.locationRecords = locationRecords;
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
