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
  Identifiable
} from 'sr2020-mm-event-engine';

import {
  gettable, 
  postable, 
  puttable, 
  deletable, 
  multiPuttable,
} from './apiInterfaces';

import {  
  Gettable,
  Postable,
  Puttable,
  Deletable,
  MultiPuttable,
  validateEntityFunction,
} from "../types";

import {
  locationsUrl,
  beaconsUrl,
  usersUrl,
  positionUrl,
  defaultBeaconRecord,
  defaultLocationRecord,
} from '../constants';

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

export class GettableResourceProvider<T> implements Gettable<T> {
  constructor(public url: string, public validateGetEntity: validateEntityFunction<T>) {
    return Object.assign(
      this,
      gettable(this),
    );
  }
  // all methods will be created by object assign
  get(): Promise<T[]> { throw new Error('Method not implemented.'); }
}

export class RemoteBeaconRecordProvider extends ManageableResourceProvider<BeaconRecord> {
  constructor() {
    super(
      beaconsUrl, 
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
      locationsUrl, 
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
    // super(usersUrl, validateRawUserRecord);
    super(usersUrl, (t: any): t is RawUserRecord => true);
  }
}

// Test class to get frequently changed user data.
// export class UsersRecordProviderMock {
//   isEven = true;

//   async get() {
//     this.isEven = !this.isEven;
//     return R.clone(this.isEven ? [users[1]] : users);
//   }
// }

export async function innerPostUserPosition(characterId: number, beacon: BeaconRecord) {
  return fetchWithTimeout(positionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'X-User-Id': String(characterId),
    },
    body: JSON.stringify({
      beacons: [{
        ssid: beacon.ssid,
        bssid: beacon.bssid,
        level: -10,
      }],
    }),
  });
}

// function ReadWriteResourceProvider(url) {
//   this.url = url;

//   return Object.assign(
//     this,
//     gettable(this),
//     postable(this),
//   );
// }

// fetch('https://gateway.evarun.ru/api/v1/config/test')
// fetch('https://gateway.evarun.ru/api/v1/config/manaOceanConfig')
//   .then(res => res.json())
//   .then(console.log)

// fetch('https://gateway.evarun.ru/api/v1/config/test', {
// fetch('https://gateway.evarun.ru/api/v1/config/manaOceanConfig', {
//   method: 'POST',
//   body: JSON.stringify({})
// }).then(res => res.json()).then(console.log)
// fetch('https://gateway.evarun.ru/api/v1/config/manaOceanConfig', {
//   method: 'POST',
//   body: JSON.stringify({
//     neutralManaLevel: 3,
//     visibleMoonPeriod: 180,
//     visibleMoonNewMoonTime: 0,
//     visibleMoonManaTideHeight: 1,
//     invisibleMoonPeriod: 270,
//     invisibleMoonNewMoonTime: 120,
//     invisibleMoonManaTideHeight: 1,
//     moscowTime: 0,
//   }),
// }).then((res) => res.json()).then(console.log);
