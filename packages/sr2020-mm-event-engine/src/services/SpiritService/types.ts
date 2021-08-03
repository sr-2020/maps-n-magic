import { 
  Metadata, 
  Typed,
  TypeOnly,
  ServiceContract,
  ServiceContractTypes
} from '../../core';

import { 
  Spirit
} from "../../types";



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
export type EPutSpiritsRequested = Typed<'putSpiritsRequested', {
  updates: PutSpiritArgs[]
}>;
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
export type EPutSpiritsConfirmed = Typed<'putSpiritsConfirmed', {
  spirits: Spirit[]
}>;
export type EDeleteSpiritConfirmed = Typed<'deleteSpiritConfirmed', SingleSpirit>;
export type ESetSpirits = Typed<'setSpirits', SpiritList>;
export type ECloneSpiritRequested = Typed<'cloneSpiritRequested', {
  id: number;
}>;

export type SpiritListenEvents = 
  | EPostSpiritConfirmed
  | EPutSpiritConfirmed
  | EDeleteSpiritConfirmed
  | ESetSpirits
  | ECloneSpiritRequested
  | EPutSpiritsConfirmed
;

export interface SpiritServiceContract extends ServiceContract {
  Request: GetSpirits | GetSpirit;
  Action: never;
  EmitEvent: SpiritEmitEvents;
  ListenEvent: SpiritListenEvents;
  NeedAction: never;
  NeedRequest: never;
}

export const spiritMetadata: ServiceContractTypes<SpiritServiceContract> = {
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
    'cloneSpiritRequested',
    'putSpiritsConfirmed'
  ],
  needActions: [],
  needRequests: [],
};