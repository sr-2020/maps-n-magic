import { 
  Metadata, 
  Typed,
  TypeOnly,
  ServiceContract,
  ServiceContractTypes
} from '../../core';

import { 
  SpiritPhrase
} from "../../types";

// requests

export type GetSpiritPhrases = (arg: Typed<'spiritPhrases'>) => SpiritPhrase[];
export type GetSpiritPhrase = (arg: Typed<'spiritPhrase', {id: number}>) => SpiritPhrase | undefined;
export type GetRandomSpiritPhrase = (arg: Typed<'randomSpiritPhrase', {
  characterId: number;
  spiritFractionId: number;
}>) => string | null;

// emit events

export type SingleSpiritPhrase = {
  spiritPhrase: SpiritPhrase;
};
export type PostSpiritPhraseArgs = {
  props: Partial<Omit<SpiritPhrase, 'id'>>
};
export type PutSpiritPhraseArgs = {
  id: number;
  props: Partial<Omit<SpiritPhrase, 'id'>>;
};
export type DeleteSpiritPhraseArgs = {
  id: number;
};

export type SpiritPhraseList = {
  spiritPhrases: SpiritPhrase[]
};

export type EPostSpiritPhraseRequested = Typed<'postSpiritPhraseRequested', PostSpiritPhraseArgs>;
export type EPostSpiritPhrase = Typed<'postSpiritPhrase', SingleSpiritPhrase>;
export type EPutSpiritPhraseRequested = Typed<'putSpiritPhraseRequested', PutSpiritPhraseArgs>;
export type EPutSpiritPhrase = Typed<'putSpiritPhrase', SingleSpiritPhrase>;
export type EDeleteSpiritPhraseRequested = Typed<'deleteSpiritPhraseRequested', DeleteSpiritPhraseArgs>;
export type EDeleteSpiritPhrase = Typed<'deleteSpiritPhrase', SingleSpiritPhrase>;
export type ESpiritPhrasesChanged = Typed<'spiritPhrasesChanged', SpiritPhraseList>;

export type SpiritPhraseEmitEvents = 
  EPostSpiritPhrase |
  EPutSpiritPhrase |
  EDeleteSpiritPhrase |
  ESpiritPhrasesChanged |
  EPostSpiritPhraseRequested
;

// listen events

export type EPostSpiritPhraseConfirmed = Typed<'postSpiritPhraseConfirmed', SingleSpiritPhrase>;
export type EPutSpiritPhraseConfirmed = Typed<'putSpiritPhraseConfirmed', SingleSpiritPhrase>;
export type EDeleteSpiritPhraseConfirmed = Typed<'deleteSpiritPhraseConfirmed', SingleSpiritPhrase>;
export type ESetSpiritPhrases = Typed<'setSpiritPhrases', SpiritPhraseList>;
// export type ECloneSpiritPhraseRequested = Typed<'cloneSpiritPhraseRequested', {
//   id: number;
// }>;

export type SpiritPhraseListenEvents = 
  | EPostSpiritPhraseConfirmed
  | EPutSpiritPhraseConfirmed
  | EDeleteSpiritPhraseConfirmed
  | ESetSpiritPhrases
  // ECloneSpiritPhraseRequested
;

export interface SpiritPhraseServiceContract extends ServiceContract {
  Request: GetSpiritPhrases | GetSpiritPhrase | GetRandomSpiritPhrase;
  Action: never;
  EmitEvent: SpiritPhraseEmitEvents;
  ListenEvent: SpiritPhraseListenEvents;
  NeedAction: never;
  NeedRequest: never;
}

export const spiritPhraseMetadata: ServiceContractTypes<SpiritPhraseServiceContract> = {
  requests: ['spiritPhrases', 'spiritPhrase', 'randomSpiritPhrase'],
  actions: [],
  emitEvents: [
    'postSpiritPhrase',
    'postSpiritPhraseRequested',
    'putSpiritPhrase',
    'deleteSpiritPhrase',
    'spiritPhrasesChanged',
  ],
  listenEvents: [
    'postSpiritPhraseConfirmed',
    'putSpiritPhraseConfirmed',
    'deleteSpiritPhraseConfirmed',
    'setSpiritPhrases',
    // 'cloneSpiritPhraseRequested'
  ],
  needActions: [],
  needRequests: [],
};