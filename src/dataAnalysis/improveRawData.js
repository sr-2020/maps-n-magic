// const R = require('ramda');
import R from 'ramda';
// const { bssid2id, resolveBssidToId } = require('./beaconUtils');
import {
  bssid2id, resolveBssidToId,
} from './beaconUtils.js';
import {
  dateStrToMillis, getLoudestBeacon,
} from './utils.js';

// const { dateStrToMillis, getLoudestBeacon } = require('./utils');

const sortByTime = R.sortBy(R.prop('timeMillis'));

export function improveData(data) {
  const data2 = data
    .map((el) => ({
      ...el,
      beacons: resolveBssidToId(bssid2id, el.beacons),
    }))
    .map((el) => ({
      ...el,
      timeMillis: dateStrToMillis(el.created_at) + 60000 * 120,
      loudestBeacon: getLoudestBeacon(el.beacons),
    }));
  return sortByTime(data2);
}

// console.log(JSON.stringify(sortByTime(data2), null, '  '));
