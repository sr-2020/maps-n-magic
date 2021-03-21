import { 
  Metadata, 
  Typed,
  TypeOnly,
} from '../../core';

import { 
  LocationRecord,
  TriangulationData
} from "../../types";

export const metadata: Metadata = {
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

export type PutLocationRecord = Typed<'putLocationRecord', SingleLocationRecord>;
export type PutLocationRecordConfirmed = Typed<'putLocationRecordConfirmed', SingleLocationRecord>;
export type PostLocationRecord = Typed<'postLocationRecord', SingleLocationRecord>;
export type PostLocationRecordConfirmed = Typed<'postLocationRecordConfirmed', SingleLocationRecord>;
export type DeleteLocationRecord = Typed<'deleteLocationRecord', SingleLocationRecord>;
export type DeleteLocationRecordConfirmed = Typed<'deleteLocationRecordConfirmed', SingleLocationRecord>;

export type LocationRecordList = {
  locationRecords: LocationRecord[]
};

export type SetLocationRecords = Typed<'setLocationRecords', LocationRecordList>;
export type PutLocationRecords = Typed<'putLocationRecords', LocationRecordList>;
export type PutLocationRecordsConfirmed = Typed<'putLocationRecordsConfirmed', LocationRecordList>;

// events

export type EPutLocationRecordRequested = Typed<'putLocationRecordRequested', SingleLocationRecord>;
export type EPutLocationRecord = Typed<'putLocationRecord', SingleLocationRecord>;
export type EPostLocationRecordRequested = Typed<'postLocationRecordRequested', SingleLocationRecord>;
export type EPostLocationRecord = Typed<'postLocationRecord', SingleLocationRecord>;
export type EDeleteLocationRecordRequested = Typed<'deleteLocationRecordRequested', SingleLocationRecord>;
export type EDeleteLocationRecord = Typed<'deleteLocationRecord', SingleLocationRecord>;

export type EPutLocationRecordsRequested = Typed<'putLocationRecordsRequested', LocationRecordList>;
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


// function assertIsRegExp(arg: unknown): asserts arg is RegExp {
//   if (! (arg instanceof RegExp)) {
//     throw new TypeError('Not a RegExp: ' + arg);
//   }
// }