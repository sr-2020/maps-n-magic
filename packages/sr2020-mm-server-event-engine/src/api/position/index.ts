// eslint-disable-next-line max-classes-per-file
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
  gettable, 
  postable, 
  puttable, 
  deletable, 
  multiPuttable,
  singleGettable,
} from './apiInterfaces';

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
  mainServerConstants,
} from '../constants';

export * from './mocks';

export class ManageableResourceProvider<T extends Identifiable> implements 
  Gettable<T>, 
  Postable<T>, 
  Puttable<T>, 
  Deletable<T> 
{
  constructor(
    public url: string, 
    public defaultObject: Omit<T, 'id'>, 
    public validateGetEntity: validateEntityFunction<T>,
    public validatePostEntity: validateEntityFunction<Omit<T, "id">>,
    public validatePutEntity: validateEntityFunction<Partial<Omit<T, "id">>>,
  ) {
    return Object.assign(
      this,
      gettable(this),
      postable(this),
      puttable(this),
      deletable(this),
    );
  }
  // all methods will be created by object assign
  delete({ id }: { id: number; }): Promise<T> { throw new Error('Method not implemented.'); }
  put({ id, props }: {
    id: number;
    props: T;
  }): Promise<T> { throw new Error('Method not implemented.'); }
  post({ props }: { props: Omit<T, 'id'>; }): Promise<T> { throw new Error('Method not implemented.'); }
  get(): Promise<T[]> { throw new Error('Method not implemented.'); }
}

export class ManageablePlusResourceProvider<T extends Identifiable> implements 
  Gettable<T>, 
  Postable<T>, 
  Puttable<T>, 
  Deletable<T>, 
  MultiPuttable<T>
{
  constructor(
    public url: string, 
    public defaultObject: Omit<T, 'id'>, 
    public validateGetEntity: validateEntityFunction<T>,
    public validatePostEntity: validateEntityFunction<Omit<T, "id">>,
    public validatePutEntity: validateEntityFunction<Partial<Omit<T, "id">>>,
    public validatePutEntity2: validateEntityFunction<Partial<Omit<T, "id">>>,
  ) {
    return Object.assign(
      this,
      gettable(this),
      postable(this),
      puttable(this),
      deletable(this),
      multiPuttable(this),
    );
  }
  // all methods will be created by object assign
  delete({ id }: { id: number; }): Promise<T> { throw new Error('Method not implemented.'); }
  put({ id, props }: {
    id: number;
    props: T;
  }): Promise<T> { throw new Error('Method not implemented.'); }
  post({ props }: { props: Omit<T, 'id'>; }): Promise<T> { throw new Error('Method not implemented.'); }
  get(): Promise<T[]> { throw new Error('Method not implemented.'); }
  putMultiple({ updates }: { updates: T[]; }): Promise<T[]> { throw new Error('Method not implemented.');}
}

export class GettableResourceProvider<T> implements Gettable<T>, SingleGettable<T> {
  constructor(public url: string, public validateGetEntity: validateEntityFunction<T>) {
    return Object.assign(
      this,
      gettable(this),
      singleGettable(this)
    );
  }
  // all methods will be created by object assign
  get(): Promise<T[]> { throw new Error('Method not implemented.'); }
  singleGet({ id }: { id: number; }): Promise<T | undefined> { throw new Error('Method not implemented.'); }
}

export class RemoteBeaconRecordProvider extends ManageableResourceProvider<BeaconRecord> {
  constructor() {
    super(
      mainServerConstants().beaconsUrl, 
      defaultBeaconRecord, 
      validateBeaconRecord,
      validateBeaconRecordPost,
      validateBeaconRecordPut,
      // (t: any): t is BeaconRecord => true
    );
  }
}

export class RemoteLocationRecordProvider extends ManageablePlusResourceProvider<LocationRecord> {
  constructor() {
    // super(locationsUrl, defaultLocationRecord, validateLocationRecord);
    super(
      mainServerConstants().locationsUrl, 
      defaultLocationRecord, 
      // validateLocationRecord,
      (t: any): t is LocationRecord => true,
      validateLocationRecordPost,
      validateLocationRecordPut,
      (t: any): t is LocationRecord => true,
      // validateLocationRecordPut2
    );
  }
}

export class RemoteUsersRecordProvider extends GettableResourceProvider<RawUserRecord> {
  constructor() {
    super(mainServerConstants().usersUrl, (t: any): t is RawUserRecord => true);
  }
}
