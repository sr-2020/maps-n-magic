const R = require('ramda');
const rawData = require('./data/rawBeaconMessages');
const { bssid2id, resolveBssidToId } = require('./beaconUtils');

const { dateStrToMillis, getLoudestBeacon } = require('./utils');


// const data = rawData.slice(0, 5);
// const data = rawData;

const sortByTime = R.sortBy(R.prop('timeMillis'));

function improveData(data) {
  const data2 = data
    .map((el) => ({
      ...el,
      beacons: resolveBssidToId(bssid2id, el.beacons),
    }))
    .map((el) => ({
      ...el,
      timeMillis: dateStrToMillis(el.created_at),
      loudestBeacon: getLoudestBeacon(el.beacons),
    }));
  return sortByTime(data2);
}

exports.improveData = improveData;


// console.log(JSON.stringify(sortByTime(data2), null, '  '));
