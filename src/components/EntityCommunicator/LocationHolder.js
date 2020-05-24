import * as R from 'ramda';

import { RemoteHolder } from './RemoteHolder';

const url = 'https://position.evarun.ru/api/v1/locations';

// duplicated in LocationRecordService
const defaultStyleOptions = {
  color: '#3388ff',
  weight: 3,
  fillOpacity: 0.2,
};

const defaultLocation = {
  label: '',
  created_at: null,
  updated_at: null,
  polygon: [],
  options: {
    ...defaultStyleOptions,
  },
  layer_id: 1,
};

export class LocationHolder extends RemoteHolder {
  constructor() {
    super(url, defaultLocation);
  }
}
