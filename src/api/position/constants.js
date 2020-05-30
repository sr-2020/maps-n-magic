export const beaconsUrl = 'https://position.evarun.ru/api/v1/beacons';
export const locationsUrl = 'https://position.evarun.ru/api/v1/locations';
export const usersUrl = 'https://position.evarun.ru/api/v1/users';
export const positionUrl = 'http://position.evarun.ru/api/v1/positions';

export const defaultBeaconRecord = {
  ssid: '',
  bssid: '',
  location_id: null,
  label: '',
  lat: 0,
  lng: 0,
};

// duplicated in LocationRecordService
const defaultLocationStyleOptions = {
  color: '#3388ff',
  weight: 3,
  fillOpacity: 0.2,
};

export const defaultLocationRecord = {
  label: '',
  created_at: null,
  updated_at: null,
  polygon: [],
  options: {
    ...defaultLocationStyleOptions,
  },
  layer_id: 1,
};
