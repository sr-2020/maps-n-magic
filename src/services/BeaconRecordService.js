import * as R from 'ramda';

import { AbstractService } from './AbstractService';

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
    this.beaconRecords = beaconRecords;
    this.emit('beaconRecordsChanged', {
      beaconRecords,
    });
  }

  putBeaconRecord({ id, props }) {
    this.emit('putBeaconRecordRequested', { id, props });
  }

  postBeaconRecord = ({ props }) => {
    this.emit('postBeaconRecordRequested', { props });
  }

  deleteBeaconRecord = ({ id }) => {
    this.emit('deleteBeaconRecordRequested', { id });
  }

  putBeaconRecordConfirmed({ beaconRecord }) {
    const index = this.beaconRecords.findIndex((br) => br.id === beaconRecord.id);
    this.beaconRecords[index] = beaconRecord;
    this.emit('putBeaconRecord', { beaconRecord });
  }

  deleteBeaconRecordConfirmed({ beaconRecord }) {
    this.beaconRecords = this.beaconRecords.filter((br) => br.id !== beaconRecord.id);
    this.emit('deleteBeaconRecord', { beaconRecord });
  }

  postBeaconRecordConfirmed({ beaconRecord }) {
    this.beaconRecords.push(beaconRecord);
    // console.log('postBeaconRecord');
    this.emit('postBeaconRecord', { beaconRecord });
  }
}
