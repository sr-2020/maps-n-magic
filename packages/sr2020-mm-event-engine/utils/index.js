import * as R from 'ramda';

export function isGeoLocation(location) {
  return location.layer_id === 1 && !R.isEmpty(location.polygon);
}
