import { 
  Metadata, 
  Typed,
  TypeOnly,
  ServiceContract,
  ServiceContractTypes
} from '../../core';

import { 
  TriangulationData,
  LocationRecord,
  LocationUpdate
} from "../../domain";

// requests

export type GetLocationRecords = (arg: TypeOnly<'locationRecords'>) => LocationRecord[];
export type GetLocationRecord = (arg: Typed<'locationRecord', {
  id: number
}>) => LocationRecord | null;
export type GetTriangulationData = (arg: TypeOnly<'triangulationData'>) => TriangulationData | null;
export type GetNeighborList = (arg: Typed<'neighborList', {
  locationId: number
}>) => LocationRecord[];
export type GetNeighborOrRandomLocation = (arg: Typed<'neighborOrRandomLocation', {
  locationId: number
}>) => LocationRecord | null;

// actions

export type SingleLocationRecord = {
  locationRecord: LocationRecord;
};
export type PutLocationArgs = {
  id: number;
  props: Partial<Omit<LocationRecord, 'id'>>;
};
export type PostLocationArgs = {
  props: Partial<Omit<LocationRecord, 'id'>>
};

export type PutLocationRecord = (arg: Typed<'putLocationRecord', PutLocationArgs>) => void;
export type PutLocationRecordConfirmed = (arg: Typed<'putLocationRecordConfirmed', SingleLocationRecord>) => void;
export type PostLocationRecord = (arg: Typed<'postLocationRecord', PostLocationArgs>) => void;
export type PostLocationRecordConfirmed = (arg: Typed<'postLocationRecordConfirmed', SingleLocationRecord>) => void;
export type DeleteLocationRecord = (arg: Typed<'deleteLocationRecord', SingleLocationRecord>) => void;
export type DeleteLocationRecordConfirmed = (arg: Typed<'deleteLocationRecordConfirmed', SingleLocationRecord>) => void;

export type LocationRecordList = {
  locationRecords: LocationRecord[]
};
export type UpdateLocationRecordList = {
  updates: LocationUpdate[]
};

export type SetLocationRecords = (arg: Typed<'setLocationRecords', LocationRecordList>) => void;
export type PutLocationRecords = (arg: Typed<'putLocationRecords', UpdateLocationRecordList>) => void;
export type PutLocationRecordsConfirmed = (arg: Typed<'putLocationRecordsConfirmed', LocationRecordList>) => void;

// events

export type EPutLocationRecordRequested = Typed<'putLocationRecordRequested', PutLocationArgs>;
export type EPutLocationRecord = Typed<'putLocationRecord', SingleLocationRecord>;
export type EPostLocationRecordRequested = Typed<'postLocationRecordRequested', PostLocationArgs>;
export type EPostLocationRecord = Typed<'postLocationRecord', SingleLocationRecord>;
export type EDeleteLocationRecordRequested = Typed<'deleteLocationRecordRequested', SingleLocationRecord>;
export type EDeleteLocationRecord = Typed<'deleteLocationRecord', SingleLocationRecord>;

export type EPutLocationRecordsRequested = Typed<'putLocationRecordsRequested', UpdateLocationRecordList>;
export type EPutLocationRecords = Typed<'putLocationRecords', LocationRecordList>;
export type ELocationRecordsChanged = Typed<'locationRecordsChanged', LocationRecordList>;
export type ELocationRecordsChanged2 = Typed<'locationRecordsChanged2', LocationRecordList>;

export type LocationRecordEvents = 
  EPostLocationRecordRequested |
  EPostLocationRecord |
  EDeleteLocationRecordRequested |
  EDeleteLocationRecord |
  EPutLocationRecordRequested |
  EPutLocationRecord |
  EPutLocationRecordsRequested |
  EPutLocationRecords |
  ELocationRecordsChanged |
  ELocationRecordsChanged2
;

export interface LocationRecordServiceContract extends ServiceContract {
  Request: 
    | GetLocationRecord
    | GetLocationRecords 
    | GetTriangulationData 
    | GetNeighborOrRandomLocation 
    | GetNeighborList;
  Action: 
    | PutLocationRecord
    | PutLocationRecordConfirmed
    | PostLocationRecord
    | PostLocationRecordConfirmed
    | DeleteLocationRecord
    | DeleteLocationRecordConfirmed
    | SetLocationRecords
    | PutLocationRecords
    | PutLocationRecordsConfirmed;
  EmitEvent: LocationRecordEvents;
  ListenEvent: never;
  NeedAction: never;
  NeedRequest: never;
}

export const lrsMetadata: ServiceContractTypes<LocationRecordServiceContract> = {
  requests: [
    'locationRecord',
    'locationRecords',
    'triangulationData',
    'neighborOrRandomLocation',
    'neighborList',
  ],
  actions: [
    // single location actions
    'putLocationRecord',
    'putLocationRecordConfirmed',
    'postLocationRecord',
    'postLocationRecordConfirmed',
    'deleteLocationRecord',
    'deleteLocationRecordConfirmed',
    // multi location actions
    'setLocationRecords',
    'putLocationRecords',
    'putLocationRecordsConfirmed',
  ],
  emitEvents: [
    // single location events
    'postLocationRecordRequested',
    'postLocationRecord',
    'deleteLocationRecordRequested',
    'deleteLocationRecord',
    'putLocationRecordRequested',
    'putLocationRecord',
    // multi location events
    'putLocationRecordsRequested',
    'putLocationRecords',
    'locationRecordsChanged',
    'locationRecordsChanged2',
  ],
  listenEvents: [],
  needActions: [],
  needRequests: []
};

// function assertIsRegExp(arg: unknown): asserts arg is RegExp {
//   if (! (arg instanceof RegExp)) {
//     throw new TypeError('Not a RegExp: ' + arg);
//   }
// }
