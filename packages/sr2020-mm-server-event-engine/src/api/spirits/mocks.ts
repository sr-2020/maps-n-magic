import { 
  Feature,
  Identifiable,
  PlayerMessage,
  Spirit,
  SpiritFraction,
  SpiritPhrase,
  SpiritRoute,
  validateFeature,
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

import { 
  features,
  playerMessages
} from '../../mockedData';

export class MockedGettableResourceProvider2<T extends Identifiable> implements 
  Gettable2<T>,
  SingleGettable2<T>
{
  constructor(public entities: T[], public validateEntity: validateEntityFunction<T>) {
  }
  get(): Promise<unknown[]> {
    return Promise.resolve(this.entities);
  }
  singleGet(id: string | number): Promise<unknown> {
    throw new Error('Method not implemented.');
  }
}

export class MockedPlayerMessageProvider extends 
  MockedGettableResourceProvider2<PlayerMessage>
{
  constructor() {
    super(playerMessages, validatePlayerMessage);
  }
}

export class MockedFeatureProvider extends 
  MockedGettableResourceProvider2<Feature>
{
  constructor() {
    super(features, validateFeature);
  }
}

