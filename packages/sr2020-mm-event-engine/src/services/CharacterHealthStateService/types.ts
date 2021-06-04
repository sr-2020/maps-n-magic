import { 
  Metadata, 
  Typed,
  TypeOnly,
  ServiceContract,
  ServiceContractTypes,
} from '../../core';

import { 
  CharacterHealthStates, 
  RawCharacterHealthState,
} from "../../types";

import { GetLocationRecord } from "../../index";

// requests

export type GetCharacterHealthState = (arg: Typed<'characterHealthState', {
  id: number;
}>) => RawCharacterHealthState;

export type GetCharacterHealthStates = (arg: TypeOnly<'characterHealthStates'>) => CharacterHealthStates;

// actions

export interface PutCharHealthArgs {
  characterId: number;
  characterHealthState: RawCharacterHealthState;
}

export interface PutCharLocationArgs {
  characterId: number;
  locationId: number;
  prevLocationId: number;
}

// events

export type EPutCharHealthRequested = Typed<'putCharHealthRequested', PutCharHealthArgs>;
export type EPutCharLocationRequested = Typed<'putCharLocationRequested', PutCharLocationArgs>;
export type ECharacterHealthStateChanged = Typed<'characterHealthStateChanged', {
  characterId: number;
  characterHealthState: RawCharacterHealthState;
  prevCharacterHealthState: RawCharacterHealthState;
}>;
export type ECharacterHealthStatesLoaded = Typed<'characterHealthStatesLoaded', {
  characterHealthStates: CharacterHealthStates;
}>;

export type CharacterHealthStateEmitEvents = 
  EPutCharLocationRequested |
  ECharacterHealthStateChanged |
  ECharacterHealthStatesLoaded;

export type EPutCharHealthConfirmed = Typed<'putCharHealthConfirmed', PutCharHealthArgs>;
export type EPutCharLocationConfirmed = Typed<'putCharLocationConfirmed', PutCharLocationArgs>;
export type ESetCharacterHealthStates = Typed<'setCharacterHealthStates', {
  characterHealthStates: CharacterHealthStates;
}>;

export type CharacterHealthStateListenEvents = 
  EPutCharHealthConfirmed |
  EPutCharLocationConfirmed |
  ESetCharacterHealthStates;

export interface CharacterHealthStateServiceContract extends ServiceContract {
  Request: GetCharacterHealthState | GetCharacterHealthStates;
  Action: never;
  EmitEvent: CharacterHealthStateEmitEvents;
  ListenEvent: CharacterHealthStateListenEvents;
  NeedAction: never;
  NeedRequest: GetLocationRecord;
}

export const chssMetadata: ServiceContractTypes<CharacterHealthStateServiceContract> = {
  actions: [
  ],
  requests: [
    'characterHealthState', 'characterHealthStates',
  ],
  emitEvents: [
    'characterHealthStateChanged',
    'characterHealthStatesLoaded',
  ],
  listenEvents: [
    'putCharHealthConfirmed',
    'putCharLocationConfirmed',
    'setCharacterHealthStates',
  ],
  needRequests: ['locationRecord'],
  needActions: [],
};