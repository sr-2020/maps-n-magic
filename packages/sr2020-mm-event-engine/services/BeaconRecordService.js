import * as R from 'ramda';

import { AbstractService } from '../core/AbstractService';

import { getArrDiff } from '../utils';

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

  setData({ beaconRecords = [] } = {}) {
    // better data reuse
    // const { updated, added, unchanged } = getArrDiff(beaconRecords, this.beaconRecords, R.prop('id'));
    // this.beaconRecords = [...unchanged, ...R.pluck('item', updated), ...added];
    // return beaconRecords.length === this.beaconRecords && unchanged.length === beaconRecords.length;
    this.beaconRecords = beaconRecords;
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
    // const hasChanges =
    // if (!hasChanges) {
    //   return;
    // }
    this.emit('beaconRecordsChanged', {
      beaconRecords,
    });
    this.emit('beaconRecordsChanged2', {
      type: 'beaconRecordsChanged2',
      beaconRecords,
    });
  }

  putBeaconRecord(action) {
    // try to speedup put changes. It is still slow, so commented it out.
    // const { id, props } = action;
    // const index = this.beaconRecords.findIndex((br) => br.id === id);
    // this.beaconRecords = [...this.beaconRecords];
    // this.beaconRecords[index] = { ...this.beaconRecords[index], ...props };
    // this.emit('beaconRecordsChanged2', {
    //   type: 'beaconRecordsChanged2',
    //   beaconRecords: this.beaconRecords,
    // });
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
