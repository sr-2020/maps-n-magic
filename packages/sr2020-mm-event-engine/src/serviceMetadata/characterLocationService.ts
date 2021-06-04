import { 
  Metadata, 
  Typed,
  TypeOnly,
  CharacterLocationData,
  ServiceContract,
  ServiceContractTypes
} from '../index';

// requests

export type GetCharactersFromLocation = (arg: Typed<'charactersFromLocation', { 
  locationId: number
}>) => Set<number>;

// actions

// export type SetCharacterLocationData = {
//   characterId: number, 
//   locationId: number | null, 
//   prevLocationId: number | null
// };

// export type SetAllCharacterLocations = Typed<'setAllCharacterLocations', {
//   characterLocations: CharacterLocationData[]
// }>;
// export type SetCharacterLocation = Typed<'setCharacterLocation', SetCharacterLocationData>;
// export type EmitCharacterLocationChanged = Typed<'emitCharacterLocationChanged', {
//   characterId: number, 
// }>;

// events

export type ECharacterLocationChanged = Typed<'characterLocationChanged', SetCharacterLocationData>;

export type CharacterLocationEmitEvents = 
  ECharacterLocationChanged
;

export type SetCharacterLocationData = {
  characterId: number, 
  locationId: number | null, 
  prevLocationId: number | null
};

export type ESetAllCharacterLocations = Typed<'setAllCharacterLocations', {
  characterLocations: CharacterLocationData[]
}>;
export type ESetCharacterLocation = Typed<'setCharacterLocation', SetCharacterLocationData>;
export type EEmitCharacterLocationChanged = Typed<'emitCharacterLocationChanged', {
  characterId: number, 
}>;

export type CharacterLocationListenEvents = 
  ESetAllCharacterLocations |
  ESetCharacterLocation |
  EEmitCharacterLocationChanged;


export interface CharacterLocationServiceContract extends ServiceContract {
  Request: GetCharactersFromLocation;
  Action: never;
  EmitEvent: CharacterLocationEmitEvents;
  ListenEvent: CharacterLocationListenEvents;
  NeedAction: never;
  NeedRequest: never;
}

export const clMetadata: ServiceContractTypes<CharacterLocationServiceContract> = {
  requests: [
    'charactersFromLocation',
  ],
  actions: [
    // 'setAllCharacterLocations',
    // 'setCharacterLocation',
    // 'emitCharacterLocationChanged',
  ],
  emitEvents: [
    'characterLocationChanged',
  ],
  listenEvents: [
    'setAllCharacterLocations',
    'setCharacterLocation',
    'emitCharacterLocationChanged',
  ],
  needRequests: [
  ],
  needActions: []
};
  