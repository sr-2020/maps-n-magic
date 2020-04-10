import * as R from 'ramda';

export const hasLatLng = (el) => !!el.lat && !!el.lng;

export const getFreeBeacons = R.filter(R.pipe(hasLatLng, R.not));

export const getFreeBeaconIds = R.pipe(
  getFreeBeacons,
  R.pluck('id'),
  R.sortBy(R.identity),
);
