import { 
  Metadata, 
  Typed,
  TypeOnly,
  CharacterLocationData
} from 'sr2020-mm-event-engine';

export const clMetadata: Metadata = {
  requests: [
    'charactersFromLocation',
  ],
  actions: [
    'setAllCharacterLocations',
    'setCharacterLocation',
    'emitCharacterLocationChanged',
  ],
  emitEvents: [
    'characterLocationChanged',
  ],
  listenEvents: [
  ],
  needRequests: [
  ],
  needActions: []
};

// requests

export type GetCharactersFromLocation = (arg: Typed<'charactersFromLocation', { 
  locationId: number
}>) => Set<number>;

// actions

export type SetCharacterLocationData = {
  characterId: number, 
  locationId: number, 
  prevLocationId: number | null
};

export type SetAllCharacterLocations = Typed<'setAllCharacterLocations', {
  characterLocations: CharacterLocationData[]
}>;
export type SetCharacterLocation = Typed<'setCharacterLocation', SetCharacterLocationData>;
export type EmitCharacterLocationChanged = Typed<'emitCharacterLocationChanged', {
  characterId: number, 
}>;

// events

export type ECharacterLocationChanged = Typed<'characterLocationChanged', SetCharacterLocationData>;

export type CharacterLocationEvents = 
  ECharacterLocationChanged
;