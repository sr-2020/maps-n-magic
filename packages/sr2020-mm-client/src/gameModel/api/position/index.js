// eslint-disable-next-line max-classes-per-file
import {
  gettable, postable, puttable, deletable, postSettings, getSettings,
} from './apiInterfaces';

import {
  locationsUrl,
  beaconsUrl,
  usersUrl,
  positionUrl,
  manaOceanConfigUrl,
  defaultBeaconRecord,
  defaultLocationRecord,
} from './constants';

export class RemoteBeaconRecordProvider extends ManageableResourceProvider {
  constructor() {
    super(beaconsUrl, defaultBeaconRecord);
  }
}

export class RemoteLocationRecordProvider extends ManageableResourceProvider {
  constructor() {
    super(locationsUrl, defaultLocationRecord);
  }
}

export class RemoteUsersRecordProvider extends GettableResourceProvider {
  constructor() {
    super(usersUrl);
  }
}

export class ManaOceanSettingsProvider extends SettingsResourceProvider {
  constructor() {
    super(manaOceanConfigUrl);
  }
}

export async function postUserPosition(characterId, beacon) {
  return fetch(positionUrl, {
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

function ManageableResourceProvider(url, defaultObject) {
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

// function ReadWriteResourceProvider(url) {
//   this.url = url;

//   return Object.assign(
//     this,
//     gettable(this),
//     postable(this),
//   );
// }

function SettingsResourceProvider(url) {
  this.url = url;

  return Object.assign(
    this,
    postSettings(this),
    getSettings(this),
  );
}

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


function GettableResourceProvider(url) {
  this.url = url;

  return Object.assign(
    this,
    gettable(this),
  );
}
