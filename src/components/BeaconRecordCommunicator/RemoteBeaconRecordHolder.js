/* eslint-disable class-methods-use-this */
import * as R from 'ramda';

const defaultBeaconRecord = {
  ssid: '',
  bssid: '',
  location_id: null,
  label: '',
  lat: 0,
  lng: 0,
};

export class RemoteBeaconRecordHolder {
  get() {
    return fetch('http://position.evarun.ru/api/v1/beacons')
      .then((response) => response.json());
    // .catch((error) => console.log(error));
  }

  post({ props }) {
    return fetch('http://position.evarun.ru/api/v1/beacons', {
      method: 'POST',
      headers: {
        // 'Content-Type': 'application/json;charset=utf-8',
        // 'Access-Control-Allow-Origin': '*',
        // 'X-User-Id': 1,
      // 'Access-Control-Allow-Origin': 'https://javascript.info',
      // 'Access-Control-Allow-Origin': '*',
      // Origin: '*',
      },
      body: JSON.stringify({
        ...defaultBeaconRecord,
        ...props,
      }),
    })
      .then((response) => response.json());
    // .catch((error) => console.log(error));
  }
}
