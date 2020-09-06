import * as R from 'ramda';

// 'geolocation' layer_id = 1
// 'region' layer_id = 2
// 'gamelocation' layer_id = 3
export const locationTypes = ['region', 'geoLocation', 'gameLocation'];

export const layerIdToLayerName = {
  2: 'region',
  1: 'geoLocation',
  3: 'gameLocation',
};

export const layerNameToLayerId = R.invertObj(layerIdToLayerName);
