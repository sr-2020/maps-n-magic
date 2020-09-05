// const R = require('ramda');
import R from 'ramda';
// const { bssid2id, resolveBssidToId } = require('./beaconUtils');
import {
  bssid2id, resolveBssidToId,
} from './beaconUtils';
import {
  dateStrToMillis, getLoudestBeacon,
} from './utils';

// const { dateStrToMillis, getLoudestBeacon } = require('./utils');

const sortByTime = R.sortBy(R.prop('timeMillis'));

export function improveData(data, timeCorrection) {
  const data2 = data
    .map((el) => ({
      ...el,
      beacons: resolveBssidToId(bssid2id, el.beacons),
    }))
    .map((el) => ({
      ...el,
      timeMillis: dateStrToMillis(el.created_at) + timeCorrection,
      // loudestBeacon: getLoudestBeacon(el.beacons),
    }));
  return sortByTime(data2);
}

function mergeBeaconArrays(arr1, arr2) {
  const merge = R.pipe(
    R.groupBy(R.prop('beaconId')),
    R.values,
    R.map((arr) => {
      if (arr.length === 1) {
        return arr[0];
      }
      return {
        ...arr[0],
        level: Math.round((arr[0].level + arr[1].level) / 2),
      };
    }),
  );
  const mergeRes = merge([...arr1, ...arr2]);
  return mergeRes;
}

export function groupDataByUser(improvedData) {
  const groupByUserId = R.groupBy(R.prop('user_id'));
  const mergeMessagesWithEqualTime = R.mapObjIndexed((dataArr) => {
    const t = 4;
    return dataArr.reduce((acc, el, index, arr) => {
      if (!R.isEmpty(acc) && R.last(acc).timeMillis === el.timeMillis) {
        const prev = R.last(acc);

        if (R.isEmpty(el.beacons)) {
          if (R.isEmpty(prev.beacons)) {
            // do nothing
          } else {
            // replace last message with new one
            acc.pop();
            acc.push(el);
          }
        } else if (R.isEmpty(prev.beacons)) {
          // do nothing
        } else {
          prev.beacons = mergeBeaconArrays(prev.beacons, el.beacons);
          // prev.loudestBeacon = getLoudestBeacon(prev.beacons);
        }
      } else {
        acc.push(el);
      }
      return acc;
    }, []);
  });

  return R.pipe(groupByUserId, mergeMessagesWithEqualTime)(improvedData);
}

// console.log(JSON.stringify(sortByTime(data2), null, '  '));
