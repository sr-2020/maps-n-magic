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
  GetUserRecord,
  ESpiritsChanged
} from 'sr2020-mm-event-engine';
import { SetBackgroundSound, SetRotationSounds } from '../SoundStageService/types';

// requests

export type GetTrackedCharacterId = (arg: TypeOnly<'trackedCharacterId'>) => number | null;
export type GetTrackedCharacterLocationId = (arg: TypeOnly<'trackedCharacterLocationId'>) => number | null;

// actions

export type SetTrackedCharacterId = (arg: Typed<'setTrackedCharacterId', {
  trackedCharacterId: number | null;
}>) => void;
export type TrackedCharacterLocationChanged = (arg: Typed<'trackedCharacterLocationChanged', {
  trackedCharacterId: number | null;
  locationId: number | null;
}>) => void;

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
  ListenEvent: 
    | ELocationRecordsChanged2
    | ESpiritsChanged  
  ;
  NeedAction: 
    | SetBackgroundSound
    | SetRotationSounds  
  ;
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
    'spiritsChanged'
  ],
  needRequests: ['locationRecord', 'userRecord'],
  needActions: ['setBackgroundSound', 'setRotationSounds']
};