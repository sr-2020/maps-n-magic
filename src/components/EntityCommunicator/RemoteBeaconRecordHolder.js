import * as R from 'ramda';

import { RemoteHolder } from './RemoteHolder';

const url = 'https://position.evarun.ru/api/v1/beacons';

const defaultBeaconRecord = {
  ssid: '',
  bssid: '',
  location_id: null,
  label: '',
  lat: 0,
  lng: 0,
};

export class RemoteBeaconRecordHolder extends RemoteHolder {
  constructor() {
    super(url, defaultBeaconRecord);
  }
}
