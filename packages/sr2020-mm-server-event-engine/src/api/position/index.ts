// eslint-disable-next-line max-classes-per-file
import * as R from 'ramda';
import { 
  fetchWithTimeout,
  BeaconRecord,
  LocationRecord
} from 'sr2020-mm-event-engine';
import {
  gettable, 
  postable, 
  puttable, 
  deletable, 
  postSettings, 
  getSettings, 
  multiPuttable,
  Gettable,
  Postable,
  Puttable,
  Deletable,
  PostSettings,
  GetSettings,
  MultiPuttable
} from './apiInterfaces';

import {
  locationsUrl,
  beaconsUrl,
  usersUrl,
  positionUrl,
  manaOceanConfigUrl,
  manaOceanEffectConfigUrl,
  defaultBeaconRecord,
  defaultLocationRecord,
} from '../constants';

class ManageableResourceProvider<T> implements Gettable<T>, Postable<T>, Puttable<T>, Deletable<T> {
  constructor(public url: string, public defaultObject: T) {
    return Object.assign(
      this,
      gettable(this),
      postable(this),
      puttable(this),
      deletable(this),
    );
  }
  // all methods will be created by object assign
  deletable({ id }: { id: number; }): Promise<T> { throw new Error('Method not implemented.'); }
  put({ id, props }: {
    id: number;
    props: T;
  }): Promise<T> { throw new Error('Method not implemented.'); }
  post({ props }: { props: T; }): Promise<T> { throw new Error('Method not implemented.'); }
  get(): Promise<T[]> { throw new Error('Method not implemented.'); }
}

class ManageablePlusResourceProvider<T> implements Gettable<T>, Postable<T>, Puttable<T>, Deletable<T>, MultiPuttable<T>  {
  constructor(public url: string, public defaultObject: T) {
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
  deletable({ id }: { id: number; }): Promise<T> { throw new Error('Method not implemented.'); }
  put({ id, props }: {
    id: number;
    props: T;
  }): Promise<T> { throw new Error('Method not implemented.'); }
  post({ props }: { props: T; }): Promise<T> { throw new Error('Method not implemented.'); }
  get(): Promise<T[]> { throw new Error('Method not implemented.'); }
  putMultiple({ updates }: { updates: T[]; }): Promise<T> { throw new Error('Method not implemented.');}
}

class SettingsResourceProvider {
  constructor(public url: string) {
    return Object.assign(
      this,
      postSettings(this),
      getSettings(this),
    );
  }
}

class GettableResourceProvider {
  constructor(public url: string) {
    return Object.assign(
      this,
      gettable(this),
    );
  }
}

export class RemoteBeaconRecordProvider extends ManageableResourceProvider<Omit<BeaconRecord, 'id'>>
   {
  constructor() {
    super(beaconsUrl, defaultBeaconRecord);
  }
}

export class RemoteLocationRecordProvider extends ManageablePlusResourceProvider<Omit<LocationRecord, 'id'>> {
  constructor() {
    super(locationsUrl, defaultLocationRecord);
  }
}

export class RemoteUsersRecordProvider extends GettableResourceProvider {
  constructor() {
    super(usersUrl);
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

export class ManaOceanSettingsProvider extends SettingsResourceProvider {
  constructor() {
    super(manaOceanConfigUrl);
  }
}

export class ManaOceanEffectSettingsProvider extends SettingsResourceProvider {
  constructor() {
    super(manaOceanEffectConfigUrl);
  }
}

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
