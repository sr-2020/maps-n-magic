import * as R from 'ramda';

// 'geolocation' layer_id = 1
// 'region' layer_id = 2
// 'gamelocation' layer_id = 3
// export const locationTypes = ['region', 'geoLocation', 'gameLocation'];
// export const locationTypes = ['region', 'geoLocation', 'gameLocation'];
export const locationIdSequence = [2, 1, 3];


export enum locationTypesEnum {
  region = 'region',
  geoLocation = 'geoLocation',
  gameLocation = 'gameLocation',
}

export const locationTypeSequence = [
  locationTypesEnum.region, 
  locationTypesEnum.geoLocation, 
  locationTypesEnum.gameLocation
];

// export enum locationTypesEnum {
//   region = 2,
//   geoLocation = 1,
//   gameLocation = 3,
// }

export const layerNameToLayerId: Record<keyof typeof locationTypesEnum, number> = {
  'region': 2,
  'geoLocation': 1,
  'gameLocation': 3,
};

export const layerIdToLayerName: Record<number, keyof typeof locationTypesEnum> = {
  2: 'region',
  1: 'geoLocation',
  3: 'gameLocation',
};

// export const layerNameToLayerId = 
//   R.invertObj(layerIdToLayerName) as Record<keyof typeof locationTypesEnum, number>;
