import { 
  AbstractService, 
  Metadata, 
  GameModel, 
  GMLogger,
  Typed,
  TypeOnly,
  Req,
  Res
} from '../../core';

import { 
  LocationRecord,
  TriangulationData
} from "../../types";

export const metadata: Metadata = {
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
  requests: [
    'locationRecord',
    'locationRecords',
    'triangulationData',
    'neighborOrRandomLocation',
    'neighborList',
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

export type PutLocationRecordArgs = {
  locationRecord: LocationRecord;
};

export type PutLocationRecord = Typed<'setLocationRecords', PutLocationRecordArgs>;
export type PutLocationRecordConfirmed = Typed<'putLocationRecordConfirmed', PutLocationRecordArgs>;
export type PostLocationRecord = Typed<'postLocationRecord', PutLocationRecordArgs>;
export type PostLocationRecordConfirmed = Typed<'postLocationRecordConfirmed', PutLocationRecordArgs>;
export type DeleteLocationRecord = Typed<'deleteLocationRecord', PutLocationRecordArgs>;
export type DeleteLocationRecordConfirmed = Typed<'deleteLocationRecordConfirmed', PutLocationRecordArgs>;

export type SetLocationRecordsArgs = {
  locationRecords: LocationRecord[]
};

export type SetLocationRecords = Typed<'setLocationRecords', SetLocationRecordsArgs>;
export type PutLocationRecords = Typed<'putLocationRecords', SetLocationRecordsArgs>;
export type PutLocationRecordsConfirmed = Typed<'putLocationRecordsConfirmed', SetLocationRecordsArgs>;

// events

export type EPostLocationRecordRequested = Typed<'postLocationRecordRequested', PutLocationRecordArgs>;
export type EPostLocationRecord = Typed<'postLocationRecord', PutLocationRecordArgs>;
export type EDeleteLocationRecordRequested = Typed<'deleteLocationRecordRequested', PutLocationRecordArgs>;
export type EDeleteLocationRecord = Typed<'deleteLocationRecord', PutLocationRecordArgs>;
export type EPutLocationRecordRequested = Typed<'putLocationRecordRequested', PutLocationRecordArgs>;
export type EPutLocationRecord = Typed<'putLocationRecord', PutLocationRecordArgs>;

export type EPutLocationRecordsRequested = Typed<'putLocationRecordsRequested', SetLocationRecordsArgs>;
export type EPutLocationRecords = Typed<'putLocationRecords', SetLocationRecordsArgs>;
export type ELocationRecordsChanged = Typed<'locationRecordsChanged', SetLocationRecordsArgs>;
export type ELocationRecordsChanged2 = Typed<'locationRecordsChanged2', SetLocationRecordsArgs>;

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
