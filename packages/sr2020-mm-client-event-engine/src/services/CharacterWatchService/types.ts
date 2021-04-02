import { 
  AbstractService, 
  Metadata, 
  LocationRecord, 
  GameModel, 
  GMLogger,
  TypeOnly,
  Typed
} from 'sr2020-mm-event-engine';

export const characterWatchMetadata: Metadata = {
  requests: [
    'characterId',
    'characterLocationId',
  ],
  actions: [
    'setCharacterId',
    // fictive event, actually it is emitted by CharacterLocationService
    'characterLocationChanged',
  ],
  emitEvents: [
    'characterIdChanged',
    'emitCharacterLocationChanged',
    // fictive event, actually it is emitted by CharacterLocationService
    'characterLocationChanged',
    'setBackgroundSound',
  ],
  listenEvents: [
    'locationRecordsChanged2',
  ],
  needRequests: [],
  needActions: []
};


// requests

export type GetCharacterId = (arg: TypeOnly<'characterId'>) => number | null;
export type GetCharacterLocationId = (arg: TypeOnly<'characterLocationId'>) => number | null;

// actions

export type SetCharacterId = Typed<'setCharacterId', {
  characterId: number | null;
}>;
export type CharacterLocationChanged = Typed<'characterLocationChanged', {
  characterId: number | null;
  locationId: number | null;
}>;

// events

export type ECharacterIdChanged = Typed<'characterIdChanged', {
  characterId: number | null;
}>;
export type ECharacterLocationChanged = Typed<'characterLocationChanged', {
  characterId: number | null;
  characterLocationId: number | null;
}>;
export type EEmitCharacterLocationChanged = Typed<'emitCharacterLocationChanged', {
  characterId: number;
}>;

export type CharacterWatchEvents = 
  ECharacterIdChanged |
  ECharacterLocationChanged |
  EEmitCharacterLocationChanged;