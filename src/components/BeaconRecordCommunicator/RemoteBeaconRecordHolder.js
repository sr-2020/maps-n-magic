/* eslint-disable class-methods-use-this */
import * as R from 'ramda';

const url = 'https://position.evarun.ru/api/v1/beacons';

const defaultBeaconRecord = {
  ssid: '',
  bssid: '',
  location_id: null,
  label: '',
  lat: 0,
  lng: 0,
};

export class RemoteBeaconRecordHolder {
  async get() {
    const response = await fetch(url);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Network response was not ok ${text}`);
    }

    return response.json();
  }

  async post({ props }) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-User-Id': 1,
      },
      body: JSON.stringify({
        ...defaultBeaconRecord,
        ...props,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Network response was not ok ${text}`);
    }

    return response.json();
  }

  async put({ id, props }) {
    const response = await fetch(`${url}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-User-Id': 1,
      },
      body: JSON.stringify({
        // ...defaultBeaconRecord,
        ...props,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Network response was not ok ${text}`);
    }

    return response.json();
  }

  async delete({ id }) {
    const response = await fetch(`${url}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-User-Id': 1,
      },
      // body: JSON.stringify({
      //   // ...defaultBeaconRecord,
      //   ...props,
      // }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Network response was not ok ${text}`);
    }

    // return response.json();
    return response;
  }
}
