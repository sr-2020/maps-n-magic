import * as R from 'ramda';

import { GameModel, BeaconRecord } from 'sr2020-mm-event-engine';

const hasLatLng = (el: BeaconRecord) => !!el.lat && !!el.lng;

const getFreeBeacons = R.filter(R.pipe(hasLatLng, R.not));

export const getFreeBeaconIds: (arr: BeaconRecord[]) => number[] = R.pipe(
  getFreeBeacons,
  R.pluck('id'),
  R.sortBy(R.identity),
);
