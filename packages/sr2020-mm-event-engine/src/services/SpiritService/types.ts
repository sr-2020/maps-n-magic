import { 
  Metadata, 
  Typed,
  TypeOnly,
} from '../../core';

import { 
  Spirit
} from "../../types";

export const spiritMetadata: Metadata = {
  requests: ['spirits', 'spirit'],
  actions: [],
  emitEvents: [
    'postSpirit',
    'postSpiritRequested',
    'putSpirit',
    'deleteSpirit',
    'spiritsChanged',
  ],
  listenEvents: [
    'postSpiritConfirmed',
    'putSpiritConfirmed',
    'deleteSpiritConfirmed',
    'setSpirits',
    'cloneSpiritRequested'
  ],
  needActions: [],
  needRequests: [],
};

// requests

export type GetSpirits = (arg: TypeOnly<'spirits'>) => Spirit[];
export type GetSpirit = (arg: Typed<'spirit', {id: number}>) => Spirit | undefined;

// emit events

export type SingleSpirit = {
  spirit: Spirit;
};
export type PostSpiritArgs = {
  props: Partial<Omit<Spirit, 'id'>>
};
export type PutSpiritArgs = {
  id: number;
  props: Partial<Omit<Spirit, 'id'>>;
};
export type DeleteSpiritArgs = {
  id: number;
};

export type SpiritList = {
  spirits: Spirit[]
};

export type EPostSpiritRequested = Typed<'postSpiritRequested', PostSpiritArgs>;
export type EPostSpirit = Typed<'postSpirit', SingleSpirit>;
export type EPutSpiritRequested = Typed<'putSpiritRequested', PutSpiritArgs>;
export type EPutSpirit = Typed<'putSpirit', SingleSpirit>;
export type EDeleteSpiritRequested = Typed<'deleteSpiritRequested', DeleteSpiritArgs>;
export type EDeleteSpirit = Typed<'deleteSpirit', SingleSpirit>;
export type ESpiritsChanged = Typed<'spiritsChanged', SpiritList>;

export type SpiritEmitEvents = 
  EPostSpirit |
  EPutSpirit |
  EDeleteSpirit |
  ESpiritsChanged |
  EPostSpiritRequested
;

// listen events

export type EPostSpiritConfirmed = Typed<'postSpiritConfirmed', SingleSpirit>;
export type EPutSpiritConfirmed = Typed<'putSpiritConfirmed', SingleSpirit>;
export type EDeleteSpiritConfirmed = Typed<'deleteSpiritConfirmed', SingleSpirit>;
export type ESetSpirits = Typed<'setSpirits', SpiritList>;
export type ECloneSpiritRequested = Typed<'cloneSpiritRequested', {
  id: number;
}>;

export type SpiritListenEvents = 
  EPostSpiritConfirmed |
  EPutSpiritConfirmed |
  EDeleteSpiritConfirmed |
  ESetSpirits |
  ECloneSpiritRequested
;