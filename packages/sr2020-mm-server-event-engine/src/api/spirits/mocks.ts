import { 
  BackgroundImage,
  CharacterLifeStyle,
  Feature,
  fillNewBackgroundImage,
  fillNewSpirit,
  fillNewSpiritPhrase,
  fillNewSpiritRoute,
  Identifiable,
  PlayerMessage,
  Spirit,
  SpiritFraction,
  SpiritPhrase,
  SpiritRoute,
  unknownLifeStyle,
  validateBackgroundImage,
  validateFeature,
  validateNewBackgroundImage,
  validateNewSpirit,
  validateNewSpiritPhrase,
  validateNewSpiritRoute,
  validatePlayerMessage,
  validateSpirit,
  validateSpiritFraction,
  validateSpiritPhrase,
  validateSpiritRoute,
} from 'sr2020-mm-event-engine';

import {  
  Gettable2,
  MultiPuttable2,
  SingleGettable2,
  validateEntityFunction,
  Manageable2
} from "../types";

import { 
  features,
  playerMessages,
  spiritFractions,
  spiritPhrases,
  spiritRoutes,
  spirits
} from '../../mockedData';
import { generateIntegerId } from '../../utils';
import { backgroundImages } from '../../mockedData/backgroundImages';

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

export class MockedLifeStyleProvider implements 
  SingleGettable2<CharacterLifeStyle>
{
  validateEntity = (entity: any): entity is CharacterLifeStyle => true;
  singleGet(id: number): Promise<CharacterLifeStyle> {
    return Promise.resolve({
      ...unknownLifeStyle,
      id
    });
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

export class MockedManageableResourceProvider2<T extends Identifiable> implements Manageable2<T> {
  constructor(
    public entities: T[], 
    public validateEntity: validateEntityFunction<T>,
    public validateNewEntity: validateEntityFunction<Omit<T, "id">>,
    public generateId: (entities: T[]) => Pick<T, 'id'>
  ) {
  }
 
  get(): Promise<unknown[]> {
    return Promise.resolve(this.entities);
  }
  singleGet(id: string | number): Promise<unknown> {
    // @ts-ignore
    return this.entities.find(el => el.id === id);
  }
  post(entity: Omit<T, 'id'>): Promise<T> {
    // @ts-ignore
    const object: T = {
      ...entity,
      ...this.generateId(this.entities)
    };

    this.entities.push(object);
    return Promise.resolve(object);
  }
  fillNewEntity(entity: Partial<Omit<T, 'id'>>): Omit<T, 'id'> {
    throw new Error('Method not implemented.');
  }
  put(entity: T): Promise<T> {
    const index = this.entities.findIndex(el => el.id === entity.id);
    this.entities[index] = {
      ...this.entities[index],
      ...entity
    };
    return Promise.resolve(this.entities[index]);
  }
  delete(id: number): Promise<unknown> {
    const index = this.entities.findIndex(el => el.id === id);
    const removedItem = this.entities[index];
    this.entities = this.entities.filter(el => el.id !== id);
    return Promise.resolve(removedItem);
  }
}

export class MockedPlusManageableResourceProvider<T extends Identifiable> 
  extends MockedManageableResourceProvider2<T>
  implements MultiPuttable2<T>
{
  putMultiple(entities: T[]): Promise<T[]> {
    const updatesIndex = entities.reduce((acc, update) => {
      acc[update.id] = update;
      return acc;
    }, {} as Record<T["id"], T>);

    const updatedItems = Object.keys(updatesIndex).map(id => {
      const update = updatesIndex[id];
      const index = this.entities.findIndex(el => el.id === id);
      this.entities[index] = {
        ...this.entities[index],
        ...update
      };
      return this.entities[index];
    });
    return Promise.resolve(updatedItems);
  }
}

export class MockedSpiritFractionProvider extends 
  MockedManageableResourceProvider2<SpiritFraction>
{
  constructor() {
    super(
      spiritFractions,
      validateSpiritFraction,
      validateSpiritFraction,
      generateIntegerId
    );
  }
}

export class MockedSpiritPhraseProvider extends 
  MockedManageableResourceProvider2<SpiritPhrase>
{
  constructor() {
    super(
      spiritPhrases,
      validateSpiritPhrase,
      validateNewSpiritPhrase,
      generateIntegerId
    );
  }
  fillNewEntity = fillNewSpiritPhrase;
}

export class MockedSpiritRouteProvider extends 
  MockedManageableResourceProvider2<SpiritRoute>
{
  constructor() {
    super(
      spiritRoutes,
      validateSpiritRoute,
      validateNewSpiritRoute,
      generateIntegerId
    );
  }
  fillNewEntity = fillNewSpiritRoute;
}

export class MockedSpiritProvider extends 
  MockedPlusManageableResourceProvider<Spirit>
{
  constructor() {
    super(
      spirits,
      validateSpirit,
      validateNewSpirit,
      generateIntegerId
    );
  }
  fillNewEntity = fillNewSpirit;
}

export class MockedBackgroundImageProvider extends 
  MockedManageableResourceProvider2<BackgroundImage>
{
  constructor() {
    super(
      backgroundImages,
      validateBackgroundImage,
      validateNewBackgroundImage,
      generateIntegerId
    );
  }
  fillNewEntity = fillNewBackgroundImage;
}