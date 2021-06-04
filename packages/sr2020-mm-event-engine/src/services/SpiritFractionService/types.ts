import { 
  Metadata, 
  Typed,
  TypeOnly,
  ServiceContract,
  ServiceContractTypes
} from '../../core';

import { 
  SpiritFraction
} from "../../types";

// requests

export type GetSpiritFractions = (arg: TypeOnly<'spiritFractions'>) => SpiritFraction[];
export type GetSpiritFraction = (arg: Typed<'spiritFraction', {id: number}>) => SpiritFraction | undefined;

// emit events

export type SingleSpiritFraction = {
  spiritFraction: SpiritFraction;
};
export type PutSpiritFractionArgs = {
  id: number;
  props: Partial<Omit<SpiritFraction, 'id'>>;
};

export type SpiritFractionList = {
  spiritFractions: SpiritFraction[]
};

export type EPutSpiritFractionRequested = Typed<'putSpiritFractionRequested', PutSpiritFractionArgs>;
export type EPutSpiritFraction = Typed<'putSpiritFraction', SingleSpiritFraction>;
export type ESpiritFractionsChanged = Typed<'spiritFractionsChanged', SpiritFractionList>;

export type SpiritFractionEmitEvents = 
  | EPutSpiritFraction
  | ESpiritFractionsChanged
;

// listen events

export type EPutSpiritFractionConfirmed = Typed<'putSpiritFractionConfirmed', SingleSpiritFraction>;
export type ESetSpiritFractions = Typed<'setSpiritFractions', SpiritFractionList>;

export type SpiritFractionListenEvents = 
  | EPutSpiritFractionConfirmed
  | ESetSpiritFractions
;

export interface SpiritFractionServiceContract extends ServiceContract {
  Request: GetSpiritFractions | GetSpiritFraction;
  Action: never;
  EmitEvent: SpiritFractionEmitEvents;
  ListenEvent: SpiritFractionListenEvents;
  NeedAction: never;
  NeedRequest: never;
}

export const spiritFractionMetadata: ServiceContractTypes<SpiritFractionServiceContract> = {
  requests: ['spiritFractions', 'spiritFraction'],
  actions: [],
  emitEvents: [
    'putSpiritFraction',
    'spiritFractionsChanged',
  ],
  listenEvents: [
    'putSpiritFractionConfirmed',
    'setSpiritFractions',
  ],
  needActions: [],
  needRequests: [],
};