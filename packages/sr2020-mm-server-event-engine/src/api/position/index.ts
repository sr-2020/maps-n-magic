// eslint-disable-next-line max-classes-per-file
import * as R from 'ramda';
import { 
  fetchWithTimeout,
  BeaconRecord,
  LocationRecord,
  UserRecord,
  validateUserRecord,
  validateBeaconRecord,
  validateLocationRecord
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

export class ManageableResourceProvider<T> implements Gettable<T>, Postable<T>, Puttable<T>, Deletable<T> {
  constructor(public url: string, public defaultObject: Omit<T, 'id'>, public validateEntity: validateEntityFunction<T>) {
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

export class ManageablePlusResourceProvider<T> implements Gettable<T>, Postable<T>, Puttable<T>, Deletable<T>, MultiPuttable<T>  {
  constructor(public url: string, public defaultObject: Omit<T, 'id'>, public validateEntity: validateEntityFunction<T>) {
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
  constructor(public url: string, public validateEntity: validateEntityFunction<T>) {
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
    super(beaconsUrl, defaultBeaconRecord, validateBeaconRecord);
    // super(beaconsUrl, defaultBeaconRecord, (t: any): t is BeaconRecord => true);
  }

}

export class RemoteLocationRecordProvider extends ManageablePlusResourceProvider<LocationRecord> {
  constructor() {
    // super(locationsUrl, defaultLocationRecord, validateLocationRecord);
    super(locationsUrl, defaultLocationRecord, (t: any): t is LocationRecord => true);
  }
}

export class RemoteUsersRecordProvider extends GettableResourceProvider<UserRecord> {
  constructor() {
    // super(usersUrl, validateUserRecord);
    super(usersUrl, (t: any): t is UserRecord => true);
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
