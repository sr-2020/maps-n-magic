// eslint-disable-next-line max-classes-per-file
import * as R from 'ramda';
import { fetchWithTimeout } from 'sr2020-mm-event-engine/utils';
import {
  gettable, postable, puttable, deletable, postSettings, getSettings, multiPuttable,
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

class ManageableResourceProvider {
  url: any;

  defaultObject: any;

  constructor(url, defaultObject) {
    this.url = url;
    this.defaultObject = defaultObject;

    return Object.assign(
      this,
      gettable(this),
      postable(this),
      puttable(this),
      deletable(this),
    );
  }
}

class ManageablePlusResourceProvider {
  url: any;

  defaultObject: any;

  constructor(url, defaultObject) {
    this.url = url;
    this.defaultObject = defaultObject;

    return Object.assign(
      this,
      gettable(this),
      postable(this),
      puttable(this),
      deletable(this),
      multiPuttable(this),
    );
  }
}

class SettingsResourceProvider {
  url: any;

  constructor(url) {
    this.url = url;

    return Object.assign(
      this,
      postSettings(this),
      getSettings(this),
    );
  }
}

class GettableResourceProvider {
  url: any;

  constructor(url) {
    this.url = url;

    return Object.assign(
      this,
      gettable(this),
    );
  }
}

export class RemoteBeaconRecordProvider extends ManageableResourceProvider {
  constructor() {
    super(beaconsUrl, defaultBeaconRecord);
  }
}

export class RemoteLocationRecordProvider extends ManageablePlusResourceProvider {
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

export async function innerPostUserPosition(characterId, beacon) {
  return fetchWithTimeout(positionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'X-User-Id': characterId,
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
