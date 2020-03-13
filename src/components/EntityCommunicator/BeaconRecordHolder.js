import * as R from 'ramda';

const defaultBeaconRecord = {
  ssid: '',
  bssid: '',
  location_id: null,
  label: '',
};

export class BeaconRecordHolder {
  timeoutSize = 4000;

  beaconRecords = [
    {
      id: 10, ssid: 'EE:D2:A8:E2:1C:62', bssid: 'EE:D2:A8:E2:1C:62', location_id: 10, label: '10',
    }, {
      id: 11, ssid: 'FE:B1:7B:B6:2B:4A', bssid: 'FE:B1:7B:B6:2B:4A', location_id: 11, label: '11',
    }, {
      id: 12, ssid: 'FE:7B:B7:53:58:CB', bssid: 'FE:7B:B7:53:58:CB', location_id: 12, label: '12',
    }, {
      id: 13, ssid: 'CE:1B:0B:7F:5A:78', bssid: 'CE:1B:0B:7F:5A:78', location_id: 13, label: '13',
    }, {
      id: 14, ssid: 'DD:C3:4A:60:04:B2', bssid: 'DD:C3:4A:60:04:B2', location_id: 14, label: '14',
    },
  ];

  get() {
    return new Promise((resolve) => {
      setTimeout(() => resolve(this.beaconRecords), this.timeoutSize);
    });
  }

  put({ id, props }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.beaconRecords.findIndex((br) => br.id === id);
        const beaconRecord = {
          ...this.beaconRecords[index],
          ...props,
        };
        this.beaconRecords[index] = beaconRecord;
        resolve(beaconRecord);
      }, this.timeoutSize);
    });
  }

  post({ props }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const maxId = this.getMaxId();
        const beaconRecord = {
          ...defaultBeaconRecord,
          ...props,
          id: maxId + 1,
        };
        this.beaconRecords.push(beaconRecord);
        resolve(beaconRecord);
      }, this.timeoutSize);
    });
  }

  delete({ id }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.beaconRecords.findIndex((br) => br.id === id);
        const beaconRecord = this.beaconRecords[index];
        this.beaconRecords = this.beaconRecords.filter((br) => br.id !== id);
        resolve(beaconRecord);
      }, this.timeoutSize);
    });
  }

  getMaxId() {
    if (R.isEmpty(this.beaconRecords)) {
      return 1;
    }
    if (R.length(this.beaconRecords) === 1) {
      return this.beaconRecords[0].id;
    }
    return R.reduce(R.max, R.head(this.beaconRecords).id, R.pluck('id', this.beaconRecords));
  }
}
