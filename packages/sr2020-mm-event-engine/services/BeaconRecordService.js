import * as R from 'ramda';

import { AbstractService } from '../core/AbstractService';

export class BeaconRecordService extends AbstractService {
  metadata = {
    actions: [
      'postBeaconRecord',
      'deleteBeaconRecord',
      'putBeaconRecord',
      'postBeaconRecordConfirmed',
      'deleteBeaconRecordConfirmed',
      'putBeaconRecordConfirmed',
      'setBeaconRecords',
    ],
    requests: ['beaconRecords'],
    emitEvents: [
      'postBeaconRecord',
      'deleteBeaconRecord',
      'putBeaconRecord',
      'postBeaconRecordRequested',
      'deleteBeaconRecordRequested',
      'putBeaconRecordRequested',
      'beaconRecordsChanged',
      'beaconRecordsChanged2',
    ],
    listenEvents: [],
  };

  constructor() {
    super();
    this.beaconRecords = [];
  }

  setData({ beaconRecords } = {}) {
    this.beaconRecords = beaconRecords || [];
  }

  getData() {
    return {
      beaconRecords: this.getBeaconRecords(),
    };
  }

  getBeaconRecords() {
    return [...this.beaconRecords];
  }

  setBeaconRecords({ beaconRecords }) {
    this.setData({ beaconRecords });
    this.emit('beaconRecordsChanged', {
      beaconRecords,
    });
    this.emit('beaconRecordsChanged2', {
      type: 'beaconRecordsChanged2',
      beaconRecords,
    });
  }

  putBeaconRecord(action) {
    this.emit('putBeaconRecordRequested', action);
  }

  postBeaconRecord = (action) => {
    this.emit('postBeaconRecordRequested', action);
  }

  deleteBeaconRecord = (action) => {
    this.emit('deleteBeaconRecordRequested', action);
  }

  putBeaconRecordConfirmed({ beaconRecord }) {
    const index = this.beaconRecords.findIndex((br) => br.id === beaconRecord.id);
    this.beaconRecords = [...this.beaconRecords];
    this.beaconRecords[index] = beaconRecord;
    this.emit('putBeaconRecord', { beaconRecord });
    this.emit('beaconRecordsChanged2', {
      type: 'beaconRecordsChanged2',
      beaconRecords: this.beaconRecords,
    });
  }

  deleteBeaconRecordConfirmed({ beaconRecord }) {
    this.beaconRecords = this.beaconRecords.filter((br) => br.id !== beaconRecord.id);
    this.emit('deleteBeaconRecord', { beaconRecord });
    this.emit('beaconRecordsChanged2', {
      type: 'beaconRecordsChanged2',
      beaconRecords: this.beaconRecords,
    });
  }

  postBeaconRecordConfirmed({ beaconRecord }) {
    this.beaconRecords = [...this.beaconRecords, beaconRecord];
    // console.log('postBeaconRecord');
    this.emit('postBeaconRecord', { beaconRecord });
    this.emit('beaconRecordsChanged2', {
      type: 'beaconRecordsChanged2',
      beaconRecords: this.beaconRecords,
    });
  }
}
