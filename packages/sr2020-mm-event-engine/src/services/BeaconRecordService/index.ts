import * as R from 'ramda';

import { 
  AbstractService, 
  Metadata, 
  GameModel, 
  GMLogger,
  Req,
  Res
} from '../../core';
import { BeaconRecord } from '../../domain';

import { 
  brsMetadata,
  GetBeaconRecords,
  PutBeaconRecord,
  PutBeaconRecordConfirmed,
  PostBeaconRecord,
  PostBeaconRecordConfirmed,
  DeleteBeaconRecord,
  DeleteBeaconRecordConfirmed,
  SetBeaconRecords,
  BeaconRecordEvents,
  BeaconRecordServiceContract,
} from "./types";

type BeaconRecordsObj = { beaconRecords: BeaconRecord[] };

export class BeaconRecordService extends AbstractService<BeaconRecordServiceContract> {
  beaconRecords: BeaconRecord[];

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(brsMetadata);
    this.beaconRecords = [];
  }

  setData({ beaconRecords = [] }: BeaconRecordsObj) {
    // better data reuse
    // const { updated, added, unchanged } = getArrDiff(beaconRecords, this.beaconRecords, R.prop('id'));
    // this.beaconRecords = [...unchanged, ...R.pluck('item', updated), ...added];
    // return beaconRecords.length === this.beaconRecords && unchanged.length === beaconRecords.length;
    this.beaconRecords = beaconRecords;
  }

  // getData() {
  //   return {
  //     beaconRecords: this.getBeaconRecords(),
  //   };
  // }

  getBeaconRecords(request: Req<GetBeaconRecords>): Res<GetBeaconRecords> {
    return [...this.beaconRecords];
  }

  setBeaconRecords({ beaconRecords }: Req<SetBeaconRecords> ): Res<SetBeaconRecords> {
    this.setData({ beaconRecords });
    // const hasChanges =
    // if (!hasChanges) {
    //   return;
    // }
    this.emit2({
      type: 'beaconRecordsChanged',
      beaconRecords,
    });
    this.emit2({
      type: 'beaconRecordsChanged2',
      beaconRecords,
    });
  }

  putBeaconRecord(action: Req<PutBeaconRecord>): Res<PutBeaconRecord> {
    // try to speedup put changes. It is still slow, so commented it out.
    // const { id, props } = action;
    // const index = this.beaconRecords.findIndex((br) => br.id === id);
    // this.beaconRecords = [...this.beaconRecords];
    // this.beaconRecords[index] = { ...this.beaconRecords[index], ...props };
    // this.emit('beaconRecordsChanged2', {
    //   type: 'beaconRecordsChanged2',
    //   beaconRecords: this.beaconRecords,
    // });
    this.emit2({
      ...action,
      type: 'putBeaconRecordRequested'
    });
  }

  postBeaconRecord = (action: Req<PostBeaconRecord>): Res<PostBeaconRecord> => {
    this.emit2({
      ...action,
      type: 'postBeaconRecordRequested'
    });
  }

  deleteBeaconRecord = (action: Req<DeleteBeaconRecord>): Res<PostBeaconRecord> => {
    this.emit2({
      ...action,
      type: 'deleteBeaconRecordRequested'
    });
  }

  putBeaconRecordConfirmed({ beaconRecord }: Req<PutBeaconRecordConfirmed>): Res<PutBeaconRecordConfirmed> {
    const index: number = this.beaconRecords.findIndex((br) => br.id === beaconRecord.id);
    this.beaconRecords = [...this.beaconRecords];
    this.beaconRecords[index] = beaconRecord;
    this.emit2({ 
      type: 'putBeaconRecord',
      beaconRecord 
    });
    this.emit2({
      type: 'beaconRecordsChanged2',
      beaconRecords: this.beaconRecords,
    });
  }

  postBeaconRecordConfirmed({ beaconRecord }: Req<PostBeaconRecordConfirmed>): Res<PostBeaconRecordConfirmed> {
    this.beaconRecords = [...this.beaconRecords, beaconRecord];
    // console.log('postBeaconRecord');
    this.emit2({ 
      type: 'postBeaconRecord',
      beaconRecord 
    });
    this.emit2({
      type: 'beaconRecordsChanged2',
      beaconRecords: this.beaconRecords,
    });
  }
  
  deleteBeaconRecordConfirmed({ beaconRecord }: Req<DeleteBeaconRecordConfirmed>): Res<DeleteBeaconRecordConfirmed> {
    this.beaconRecords = this.beaconRecords.filter((br) => br.id !== beaconRecord.id);
    this.emit2({ 
      type: 'deleteBeaconRecord',
      beaconRecord 
    });
    this.emit2({
      type: 'beaconRecordsChanged2',
      beaconRecords: this.beaconRecords,
    });
  }

}
