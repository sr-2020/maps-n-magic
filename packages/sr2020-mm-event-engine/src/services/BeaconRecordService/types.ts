import { 
  Metadata, 
  Typed,
  TypeOnly,
} from '../../core';

import { 
  BeaconRecord
} from "../../types";

export const brsMetadata: Metadata = {
  requests: ['beaconRecords'],
  actions: [
    'putBeaconRecord',
    'putBeaconRecordConfirmed',
    'postBeaconRecord',
    'postBeaconRecordConfirmed',
    'deleteBeaconRecord',
    'deleteBeaconRecordConfirmed',
    'setBeaconRecords',
  ],
  emitEvents: [
    'putBeaconRecordRequested',
    'putBeaconRecord',
    'postBeaconRecordRequested',
    'postBeaconRecord',
    'deleteBeaconRecordRequested',
    'deleteBeaconRecord',
    'beaconRecordsChanged',
    'beaconRecordsChanged2',
  ],
  listenEvents: [],
  needActions: [],
  needRequests: [],
};

// requests

export type GetBeaconRecords = (arg: TypeOnly<'beaconRecords'>) => BeaconRecord[];

// actions

export type SingleBeaconRecord = {
  beaconRecord: BeaconRecord;
};

export type PutBeaconRecord = Typed<'putBeaconRecord', SingleBeaconRecord>;
export type PutBeaconRecordConfirmed = Typed<'putBeaconRecordConfirmed', SingleBeaconRecord>;
export type PostBeaconRecord = Typed<'postBeaconRecord', SingleBeaconRecord>;
export type PostBeaconRecordConfirmed = Typed<'postBeaconRecordConfirmed', SingleBeaconRecord>;
export type DeleteBeaconRecord = Typed<'deleteBeaconRecord', SingleBeaconRecord>;
export type DeleteBeaconRecordConfirmed = Typed<'deleteBeaconRecordConfirmed', SingleBeaconRecord>;

export type BeaconRecordList = {
  beaconRecords: BeaconRecord[]
};

export type SetBeaconRecords = Typed<'setBeaconRecords', BeaconRecordList>;

// events

export type EPutBeaconRecordRequested = Typed<'putBeaconRecordRequested', SingleBeaconRecord>;
export type EPutBeaconRecord = Typed<'putBeaconRecord', SingleBeaconRecord>;
export type EPostBeaconRecordRequested = Typed<'postBeaconRecordRequested', SingleBeaconRecord>;
export type EPostBeaconRecord = Typed<'postBeaconRecord', SingleBeaconRecord>;
export type EDeleteBeaconRecordRequested = Typed<'deleteBeaconRecordRequested', SingleBeaconRecord>;
export type EDeleteBeaconRecord = Typed<'deleteBeaconRecord', SingleBeaconRecord>;

export type EBeaconRecordsChanged = Typed<'beaconRecordsChanged', BeaconRecordList>;
export type EBeaconRecordsChanged2 = Typed<'beaconRecordsChanged2', BeaconRecordList>;

export type BeaconRecordEvents = 
  EPutBeaconRecordRequested |
  EPutBeaconRecord |
  EPostBeaconRecordRequested |
  EPostBeaconRecord |
  EDeleteBeaconRecordRequested |
  EDeleteBeaconRecord |
  EBeaconRecordsChanged |
  EBeaconRecordsChanged2
;