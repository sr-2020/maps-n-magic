// eslint-disable-next-line max-classes-per-file
import {
  gettable, postable, puttable, deletable,
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

export class ManaOceanSettingsProvider extends ReadWriteResourceProvider {
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

function ReadWriteResourceProvider(url) {
  this.url = url;

  return Object.assign(
    this,
    gettable(this),
    postable(this),
  );
}

function GettableResourceProvider(url) {
  this.url = url;

  return Object.assign(
    this,
    gettable(this),
  );
}
