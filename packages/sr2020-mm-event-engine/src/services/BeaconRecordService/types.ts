import { 
  Metadata, 
  Typed,
  TypeOnly,
  ServiceContract,
  ServiceContractTypes
} from '../../core';

import { 
  BeaconRecord
} from "../../domain";

// requests

export type GetBeaconRecords = (arg: TypeOnly<'beaconRecords'>) => BeaconRecord[];

// actions

export type SingleBeaconRecord = {
  beaconRecord: BeaconRecord;
};
export type PostBeaconArgs = {
  props: Partial<Omit<BeaconRecord, 'id'>>
};
export type PutBeaconArgs = {
  id: number;
  props: Partial<Omit<BeaconRecord, 'id'>>;
};
export type DeleteBeaconArgs = {
  id: number;
};

export type PostBeaconRecord = (arg: Typed<'postBeaconRecord', PostBeaconArgs>) => void;
export type PostBeaconRecordConfirmed = (arg: Typed<'postBeaconRecordConfirmed', SingleBeaconRecord>) => void;
export type PutBeaconRecord = (arg: Typed<'putBeaconRecord', PutBeaconArgs>) => void;
export type PutBeaconRecordConfirmed = (arg: Typed<'putBeaconRecordConfirmed', SingleBeaconRecord>) => void;
export type DeleteBeaconRecord = (arg: Typed<'deleteBeaconRecord', DeleteBeaconArgs>) => void;
export type DeleteBeaconRecordConfirmed = (arg: Typed<'deleteBeaconRecordConfirmed', SingleBeaconRecord>) => void;

export type BeaconRecordList = {
  beaconRecords: BeaconRecord[]
};

export type SetBeaconRecords = (arg: Typed<'setBeaconRecords', BeaconRecordList>) => void;

// events

export type EPostBeaconRecordRequested = Typed<'postBeaconRecordRequested', PostBeaconArgs>;
export type EPostBeaconRecord = Typed<'postBeaconRecord', SingleBeaconRecord>;
export type EPutBeaconRecordRequested = Typed<'putBeaconRecordRequested', PutBeaconArgs>;
export type EPutBeaconRecord = Typed<'putBeaconRecord', SingleBeaconRecord>;
export type EDeleteBeaconRecordRequested = Typed<'deleteBeaconRecordRequested', DeleteBeaconArgs>;
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

export interface BeaconRecordServiceContract extends ServiceContract {
  Request: GetBeaconRecords;
  Action: 
    | PutBeaconRecord
    | PutBeaconRecordConfirmed
    | PostBeaconRecord
    | PostBeaconRecordConfirmed
    | DeleteBeaconRecord
    | DeleteBeaconRecordConfirmed
    | SetBeaconRecords;
  EmitEvent: BeaconRecordEvents;
  ListenEvent: never;
  NeedAction: never;
  NeedRequest: never;
}

export const brsMetadata: ServiceContractTypes<BeaconRecordServiceContract> = {
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
