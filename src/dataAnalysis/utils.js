const R = require('ramda');

exports.removeAllEmptyMessages = function (data) {
  return data.filter((item) => item.beacons.length !== 0);
};

exports.getLoudestBeacon = function (beaconsArr) {
  if (beaconsArr.length === 0) {
    return null;
  }
  if (beaconsArr.length === 1) {
    return beaconsArr[0];
  }
  return beaconsArr.reduce((closest, beacon) => (closest.level > beacon.level ? closest : beacon), beaconsArr[0]);
};

exports.dateStrToMillis = function (dateStr) {
  return new Date(dateStr).getTime();
};

exports.getTimeLimits = function (data2) {
  const stats = {
    minTime: R.head(data2).created_at,
    maxTime: R.last(data2).created_at,
    minTimeMillis: R.head(data2).timeMillis,
    maxTimeMillis: R.last(data2).timeMillis,
  };
  return stats;
};
