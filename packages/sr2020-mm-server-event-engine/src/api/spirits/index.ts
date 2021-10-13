import { 
  Identifiable,
  PlayerMessage,
  Spirit,
  SpiritFraction,
  SpiritPhrase,
  SpiritRoute,
} from 'sr2020-mm-event-engine';

import {
  getSpirits,
  postSpirit,
  putSpirit,
  putMultipleSpirits,
  deleteSpirit,
  getSpirit,
} from './spirits';

import {
  getSpiritFraction,
  getSpiritFractions,
  putSpiritFraction
} from './spiritFractions';

import { 
  getSpiritRoutes, 
  postSpiritRoute, 
  putSpiritRoute, 
  deleteSpiritRoute, 
  getSpiritRoute
} from "./spiritRoutes";

import { 
  getSpiritPhrases,
  postSpiritPhrase,
  putSpiritPhrase,
  deleteSpiritPhrase,
  getSpiritPhrase
} from "./spiritPhrases";

import {  
  Gettable2,
  Postable2,
  Puttable2,
  Deletable2,
  MultiPuttable2,
  SingleGettable2,
  validateEntityFunction
} from "../types";

import { 
  validateNewSpirit, 
  fillNewSpirit, 
  validateSpirit 
} from "./spiritValidation";

import { 
  fillNewSpiritRoute, 
  validateNewSpiritRoute, 
  validateSpiritRoute 
} from "./spiritRouteValidation";

import { 
  fillNewSpiritPhrase,
  validateNewSpiritPhrase,
  validateSpiritPhrase
} from "./spiritPhraseValidation";

import { validateSpiritFraction } from "./spiritFractionValidation";
import { getPlayerMessages, validatePlayerMessage } from './playerMessages';

export * from './mocks';

export class SpiritProvider implements 
  Gettable2<Spirit>, 
  SingleGettable2<Spirit>,
  Postable2<Spirit>, 
  Puttable2<Spirit>, 
  MultiPuttable2<Spirit>,
  Deletable2<Spirit>
{
  get = getSpirits;
  singleGet = getSpirit;
  post = postSpirit;
  put = putSpirit;
  putMultiple = putMultipleSpirits;
  delete = deleteSpirit;
  validateNewEntity = validateNewSpirit;
  fillNewEntity = fillNewSpirit;
  validateEntity = validateSpirit;
}
export class SpiritFractionProvider implements 
  Gettable2<SpiritFraction>, 
  SingleGettable2<SpiritFraction>,
  Postable2<SpiritFraction>, 
  Puttable2<SpiritFraction>, 
  Deletable2<SpiritFraction>
{
  get = getSpiritFractions;
  singleGet = getSpiritFraction;
  put = putSpiritFraction;
  validateEntity = validateSpiritFraction;
  post(entity: Partial<Omit<SpiritFraction, 'id'>>): Promise<SpiritFraction> {
    throw new Error('Method post SpiritFraction not implemented.');
  }
  delete(id: number): Promise<SpiritFraction | null> {
    throw new Error('Method delete SpiritFraction not implemented.');
  }
  validateNewEntity(entity: any): entity is Omit<SpiritFraction, 'id'> {
    throw new Error('Method not implemented.');
  }
  fillNewEntity(entity: Partial<Omit<SpiritFraction, 'id'>>): Omit<SpiritFraction, 'id'> {
    throw new Error('Method not implemented.');
  }
}

export class SpiritRouteProvider implements 
  Gettable2<SpiritRoute>, 
  SingleGettable2<SpiritRoute>,
  Postable2<SpiritRoute>, 
  Puttable2<SpiritRoute>, 
  Deletable2<SpiritRoute>
{
  get = getSpiritRoutes;
  singleGet = getSpiritRoute;
  post = postSpiritRoute;
  put = putSpiritRoute;
  delete = deleteSpiritRoute;
  validateNewEntity = validateNewSpiritRoute;
  fillNewEntity = fillNewSpiritRoute;
  validateEntity = validateSpiritRoute;
}

export class SpiritPhraseProvider implements 
  Gettable2<SpiritPhrase>, 
  SingleGettable2<SpiritPhrase>,
  Postable2<SpiritPhrase>, 
  Puttable2<SpiritPhrase>, 
  Deletable2<SpiritPhrase>
{
  get = getSpiritPhrases;
  singleGet = getSpiritPhrase;
  post = postSpiritPhrase;
  put = putSpiritPhrase;
  delete = deleteSpiritPhrase;
  validateNewEntity = validateNewSpiritPhrase;
  fillNewEntity = fillNewSpiritPhrase;
  validateEntity = validateSpiritPhrase;
}

export class PlayerMessageProvider implements 
  Gettable2<PlayerMessage>,
  SingleGettable2<PlayerMessage>
{
  get = getPlayerMessages;
  validateEntity = validatePlayerMessage;
  singleGet(id: string | number): Promise<unknown> {
    throw new Error('Method not implemented.');
  }
}


