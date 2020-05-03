import * as R from 'ramda';

import { RemoteHolder } from './RemoteHolder';

const url = 'https://position.evarun.ru/api/v1/locations';

const defaultLocation = {
  label: '',
  created_at: null,
  updated_at: null,
  polygon: [],
  options: {},
  layer_id: 1,
};

export class LocationHolder extends RemoteHolder {
  constructor() {
    super(url, defaultLocation);
  }
}
