import { any } from 'ramda';
import { 
  Metadata, 
  Typed,
  TypeOnly
} from '../../core';

import { 
  CharacterHealthStates, 
  RawCharacterHealthState,
} from "../../types";

export const metadata: Metadata = {
  actions: [
    'putCharHealth',
    'putCharHealthConfirmed',
    'putCharLocation',
    'putCharLocationConfirmed',
    'setCharacterHealthStates',
  ],
  requests: [
    'characterHealthState', 'characterHealthStates',
  ],
  emitEvents: [
    'putCharHealthRequested',
    'putCharLocationRequested',
    'putCharLocationConfirmed',
    'characterHealthStateChanged',
    'characterHealthStatesLoaded',
  ],
  listenEvents: [],
  needRequests: ['locationRecord'],
  needActions: [],
};

// requests

export type GetCharacterHealthState = (arg: Typed<'characterHealthState', {
  id: number;
}>) => RawCharacterHealthState;

export type GetCharacterHealthStates = (arg: TypeOnly<'characterHealthStates'>) => CharacterHealthStates;

// type t1 = Request<CharacterHealthState>;
// type t2 = Response<CharacterHealthState>;

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

export type PutCharHealth = Typed<'putCharHealth', PutCharHealthArgs>;
export type PutCharHealthConfirmed = Typed<'putCharHealthConfirmed', PutCharHealthArgs>;
export type PutCharLocation = Typed<'putCharLocation', PutCharLocationArgs>;
export type PutCharLocationConfirmed = Typed<'putCharLocationConfirmed', PutCharLocationArgs>;
export type SetCharacterHealthStates = Typed<'setCharacterHealthStates', {
  characterHealthStates: CharacterHealthStates;
}>;

// events

export type EPutCharHealthRequested = Typed<'putCharHealthRequested', PutCharHealthArgs>;
export type EPutCharLocationRequested = Typed<'putCharLocationRequested', PutCharLocationArgs>;
export type EPutCharLocationConfirmed = Typed<'putCharLocationConfirmed', PutCharLocationArgs>;
export type ECharacterHealthStateChanged = Typed<'characterHealthStateChanged', {
  characterId: number;
  characterHealthState: RawCharacterHealthState;
  prevCharacterHealthState: RawCharacterHealthState;
}>;
export type ECharacterHealthStatesLoaded = Typed<'characterHealthStatesLoaded', {
  characterHealthStates: CharacterHealthStates;
}>;

export type Events = EPutCharHealthRequested |
  EPutCharLocationRequested |
  EPutCharLocationConfirmed |
  ECharacterHealthStateChanged |
  ECharacterHealthStatesLoaded;