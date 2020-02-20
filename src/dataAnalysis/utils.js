// const R = require('ramda');
// import R from 'ramda';
import * as R2 from 'ramda';

let R;

function getter(obj, prop) {
  return obj[prop];
}

if (Object.keys(R2).length === 1) {
  R = getter(R2, 'default');
  // R2.default;
} else {
  R = R2;
}

export const removeAllEmptyMessages = function (data) {
  return data.filter((item) => item.beacons.length !== 0);
};

export const getLoudestBeacon = function (beaconsArr) {
  if (beaconsArr.length === 0) {
    return null;
  }
  if (beaconsArr.length === 1) {
    return beaconsArr[0];
  }
  return beaconsArr.reduce((closest, beacon) => (closest.level > beacon.level ? closest : beacon), beaconsArr[0]);
};

export const dateStrToMillis = function (dateStr) {
  return new Date(dateStr).getTime();
};

export const getTimeLimits = function (data2) {
  const stats = {
    minTime: R.head(data2).created_at,
    maxTime: R.last(data2).created_at,
    minTimeMillis: R.head(data2).timeMillis,
    maxTimeMillis: R.last(data2).timeMillis,
  };
  return stats;
};
