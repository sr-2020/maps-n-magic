import { 
  Metadata, 
  Typed,
  TypeOnly,
} from '../../core';

import { 
  Spirit
} from "../../types";

export const spiritMetadata: Metadata = {
  requests: ['spirits'],
  actions: [],
  emitEvents: [
    'postSpirit',
    'putSpirit',
    'deleteSpirit',
    'spiritsChanged',
  ],
  listenEvents: [
    'postSpiritConfirmed',
    'putSpiritConfirmed',
    'deleteSpiritConfirmed',
    'setSpirits',
  ],
  needActions: [],
  needRequests: [],
};

// requests

export type GetSpirits = (arg: TypeOnly<'spirits'>) => Spirit[];

// emit events

export type SingleSpirit = {
  spirit: Spirit;
};
export type PostSpiritArgs = {
  props: Partial<Omit<Spirit, 'id'>>
};
export type PutSpiritArgs = {
  id: number;
  props: Spirit;
};
export type DeleteSpiritArgs = {
  id: number;
};

export type SpiritList = {
  spirits: Spirit[]
};

export type EPostSpirit = Typed<'postSpirit', SingleSpirit>;
export type EPutSpirit = Typed<'putSpirit', SingleSpirit>;
export type EDeleteSpirit = Typed<'deleteSpirit', SingleSpirit>;
export type ESpiritsChanged = Typed<'spiritsChanged', SpiritList>;

export type SpiritEmitEvents = 
  EPostSpirit |
  EPutSpirit |
  EDeleteSpirit |
  ESpiritsChanged
;

// listen events

export type EPostSpiritConfirmed = Typed<'postSpiritConfirmed', SingleSpirit>;
export type EPutSpiritConfirmed = Typed<'putSpiritConfirmed', SingleSpirit>;
export type EDeleteSpiritConfirmed = Typed<'deleteSpiritConfirmed', SingleSpirit>;
export type ESetSpirits = Typed<'setSpirits', SpiritList>;

export type SpiritListenEvents = 
  EPostSpiritConfirmed |
  EPutSpiritConfirmed |
  EDeleteSpiritConfirmed |
  ESetSpirits
;