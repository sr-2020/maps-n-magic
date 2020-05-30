// eslint-disable-next-line max-classes-per-file
import {
  gettable, postable, puttable, deletable,
} from './apiInterfaces';

import {
  locationsUrl,
  beaconsUrl,
  usersUrl,
  positionUrl,
  defaultBeaconRecord,
  defaultLocationRecord,
} from './constants';

export class RemoteBeaconRecordHolder extends ManageableEndpoint {
  constructor() {
    super(beaconsUrl, defaultBeaconRecord);
  }
}

export class RemoteLocationRecordHolder extends ManageableEndpoint {
  constructor() {
    super(locationsUrl, defaultLocationRecord);
  }
}

export class RemoteUsersRecordHolder extends GettableEndpoint {
  constructor() {
    super(usersUrl);
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

function ManageableEndpoint(url, defaultObject) {
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

function GettableEndpoint(url) {
  this.url = url;

  return Object.assign(
    this,
    gettable(this),
  );
}
