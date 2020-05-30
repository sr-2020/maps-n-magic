// eslint-disable-next-line max-classes-per-file
import {
  gettable, postable, puttable, deletable,
} from './apiInterfaces';

import {
  locationsUrl, beaconsUrl, defaultBeaconRecord, defaultLocationRecord,
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
