import * as R from 'ramda';
import { 
  fetchWithTimeout,
  BeaconRecord,
  LocationRecord,
  UserRecord,
  RawUserRecord,
  validateRawUserRecord,
  validateBeaconRecord,
  validateBeaconRecordPost,
  validateBeaconRecordPut,
  validateLocationRecord,
  validateLocationRecordPost,
  validateLocationRecordPut,
  validateLocationRecordPut2,
  Identifiable,
  defaultBeaconRecord,
  defaultLocationRecord
} from 'sr2020-mm-event-engine';

import {  
  Gettable,
  Postable,
  Puttable,
  Deletable,
  MultiPuttable,
  validateEntityFunction,
  SingleGettable,
} from "../types";

import { 
  userRecords, 
  beaconRecords,
  locationRecords
} from '../../mockedData';
import { generateIntegerId } from '../../utils';



export class MockedManageableResourceProvider<T extends Identifiable> implements 
  Gettable<T>, 
  Postable<T>, 
  Puttable<T>, 
  Deletable<T> 
{
  public url: string = '';

  constructor(
    public entities: T[], 
    public defaultObject: Omit<T, 'id'>, 
    public validateGetEntity: validateEntityFunction<T>,
    public validatePostEntity: validateEntityFunction<Omit<T, "id">>,
    public validatePutEntity: validateEntityFunction<Partial<Omit<T, "id">>>,
    public generateId: (entities: T[]) => Pick<T, 'id'>
  ) {
  }
  get(): Promise<T[]> {
    return Promise.resolve(this.entities);
  }
  put({ id, props }: {
    id: number;
    props: T;
  }): Promise<T> {
    const index = this.entities.findIndex(el => el.id === id);
    this.entities[index] = {
      ...this.entities[index],
      ...props
    };
    return Promise.resolve(this.entities[index]);
  }
  post({ props }: { props: Omit<T, 'id'>; }): Promise<T> { 
    // @ts-ignore
    const object: T = {
      ...this.defaultObject,
      ...props,
      ...this.generateId(this.entities)
    };

    this.entities.push(object);
    return Promise.resolve(object);
  }
  delete({ id }: { id: number; }): Promise<T> { 
    const index = this.entities.findIndex(el => el.id === id);
    const removedItem = this.entities[index];
    this.entities = this.entities.filter(el => el.id !== id);
    return Promise.resolve(removedItem);
  }
}

export class MockedPlusManageableResourceProvider<T extends Identifiable> 
  extends MockedManageableResourceProvider<T>
  implements MultiPuttable<T>
{
  constructor(
    entities: T[], 
    defaultObject: Omit<T, 'id'>, 
    validateGetEntity: validateEntityFunction<T>,
    validatePostEntity: validateEntityFunction<Omit<T, "id">>,
    validatePutEntity: validateEntityFunction<Partial<Omit<T, "id">>>,
    generateId: (entities: T[]) => Pick<T, 'id'>,
    public validatePutEntity2: validateEntityFunction<Partial<Omit<T, "id">>>,
  ) {
    super(
      entities,
      defaultObject,
      validateGetEntity,
      validatePostEntity,
      validatePutEntity,
      generateId,
    );
  }
  putMultiple({ updates }: { updates: T[]; }): Promise<T[]> {
    const updatesIndex = updates.reduce((acc, update) => {
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

export class MockedBeaconRecordProvider extends MockedManageableResourceProvider<BeaconRecord> {
  constructor() {
    super(
      beaconRecords,
      defaultBeaconRecord,
      validateBeaconRecord,
      validateBeaconRecordPost,
      validateBeaconRecordPut,
      generateIntegerId
    );
  }
}

export class MockedLocationRecordProvider extends MockedPlusManageableResourceProvider<LocationRecord> {
  constructor() {
    super(
      locationRecords,
      defaultLocationRecord,
      validateLocationRecord,
      validateLocationRecordPost,
      validateLocationRecordPut,
      generateIntegerId,
      validateLocationRecordPut
    );
  }
}

export class MockedGettableResourceProvider<T extends Identifiable> implements Gettable<T>, SingleGettable<T> {
  constructor(public entities: T[], public validateGetEntity: validateEntityFunction<T>) {
  }
  get(): Promise<T[]> {
    return Promise.resolve(this.entities);
  }
  singleGet({ id }: { id: number; }): Promise<T | undefined> {
    const result = this.entities.find(el => el.id === id);
    return Promise.resolve(result);
  }
}

export class MockedUsersRecordProvider extends MockedGettableResourceProvider<RawUserRecord> {
  constructor() {
    super(userRecords, (t: any): t is RawUserRecord => true);
  }
}