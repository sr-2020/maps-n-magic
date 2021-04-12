import { 
  AbstractService, 
  Metadata, 
  LocationRecord, 
  GameModel, 
  GMLogger,
  TypeOnly,
  Typed
} from 'sr2020-mm-event-engine';

export const trackedCharacterMetadata: Metadata = {
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
    'setBackgroundSound',
  ],
  listenEvents: [
    'locationRecordsChanged2',
  ],
  needRequests: [],
  needActions: []
};


// requests

export type GetTrackedCharacterId = (arg: TypeOnly<'trackedCharacterId'>) => number | null;
export type GetTrackedCharacterLocationId = (arg: TypeOnly<'trackedCharacterLocationId'>) => number | null;

// actions

export type SetTrackedCharacterId = Typed<'setTrackedCharacterId', {
  characterId: number | null;
}>;
export type TrackedCharacterLocationChanged = Typed<'trackedCharacterLocationChanged', {
  characterId: number | null;
  locationId: number | null;
}>;

// events

export type ETrackedCharacterIdChanged = Typed<'trackedCharacterIdChanged', {
  characterId: number | null;
}>;
export type ETrackedCharacterLocationChanged = Typed<'trackedCharacterLocationChanged', {
  characterId: number | null;
  characterLocationId: number | null;
}>;
export type EEmitTrackedCharacterLocationChanged = Typed<'emitTrackedCharacterLocationChanged', {
  characterId: number;
}>;

export type TrackedCharacterEvents = 
  ETrackedCharacterIdChanged |
  ETrackedCharacterLocationChanged |
  EEmitTrackedCharacterLocationChanged;