import { 
  AbstractService, 
  Metadata, 
  LocationRecord, 
  GameModel, 
  GMLogger,
  TypeOnly,
  Typed,
  ServiceContract,
  ServiceContractTypes,
  ELocationRecordsChanged2,
  GetLocationRecord,
  GetUserRecord
} from 'sr2020-mm-event-engine';

// requests

export type GetTrackedCharacterId = (arg: TypeOnly<'trackedCharacterId'>) => number | null;
export type GetTrackedCharacterLocationId = (arg: TypeOnly<'trackedCharacterLocationId'>) => number | null;

// actions

export type SetTrackedCharacterId = Typed<'setTrackedCharacterId', {
  trackedCharacterId: number | null;
}>;
export type TrackedCharacterLocationChanged = Typed<'trackedCharacterLocationChanged', {
  trackedCharacterId: number | null;
  locationId: number | null;
}>;

// events

export type ETrackedCharacterIdChanged = Typed<'trackedCharacterIdChanged', {
  trackedCharacterId: number | null;
}>;
export type ETrackedCharacterLocationChanged = Typed<'trackedCharacterLocationChanged', {
  trackedCharacterId: number | null;
  trackedCharacterLocationId: number | null;
}>;
export type EEmitTrackedCharacterLocationChanged = Typed<'emitTrackedCharacterLocationChanged', {
  trackedCharacterId: number;
}>;

export type TrackedCharacterEvents = 
  ETrackedCharacterIdChanged |
  ETrackedCharacterLocationChanged |
  EEmitTrackedCharacterLocationChanged;


export interface TrackedCharacterServiceContract extends ServiceContract {
  Request: GetTrackedCharacterId | GetTrackedCharacterLocationId;
  Action: 
    | SetTrackedCharacterId
    | TrackedCharacterLocationChanged;
  EmitEvent: TrackedCharacterEvents;
  ListenEvent: ELocationRecordsChanged2;
  NeedAction: never;
  NeedRequest: 
    | GetLocationRecord
    | GetUserRecord
  ;
}

export const trackedCharacterMetadata: ServiceContractTypes<TrackedCharacterServiceContract> = {
  requests: [
    'trackedCharacterId',
    'trackedCharacterLocationId',
  ],
  actions: [
    'setTrackedCharacterId',
    // fictive event, actually it is emitted by CharacterLocationService
    'trackedCharacterLocationChanged',
  ],
  emitEvents: [
    'trackedCharacterIdChanged',
    'emitTrackedCharacterLocationChanged',
    // fictive event, actually it is emitted by CharacterLocationService
    'trackedCharacterLocationChanged',
    // 'setBackgroundSound',
  ],
  listenEvents: [
    'locationRecordsChanged2',
  ],
  needRequests: ['locationRecord', 'userRecord'],
  needActions: []
};