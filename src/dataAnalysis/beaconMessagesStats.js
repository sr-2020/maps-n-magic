const R = require('ramda');
const data = require('./rawBeaconMessages_notEmpty');
const beaconTable = require('./beaconTable');

const stats = data.reduce((acc, item) => {
  if (!acc.userIds[item.user_id]) {
    acc.userIds[item.user_id] = 0;
  }
  acc.userIds[item.user_id]++;
  item.beacons.forEach((beacon) => {
    if (!acc.beaconIds[beacon.bssid]) {
      acc.beaconIds[beacon.bssid] = 0;
    }
    acc.beaconIds[beacon.bssid]++;
  });
  return acc;
}, {
  userIds: {},
  beaconIds: {},
});

console.log(stats);

const makeHist = R.compose(R.reverse, R.sortBy(R.prop(1)));
const userHist = makeHist(R.toPairs(stats.userIds));
// const userHist = R.reverse(R.sortBy(R.prop(1), R.toPairs(stats.userIds)));
console.log('userHist', userHist);

const beaconHist = makeHist(R.toPairs(stats.beaconIds));
// console.log('beaconHist', beaconHist);

const beaconIndex = R.indexBy(R.prop('bssid'), beaconTable);
// console.log('beaconIndex', beaconIndex);

console.log('beaconHist', beaconHist.map((pair) => [beaconIndex[pair[0]], pair[1]]));
const beaconIdsHist = beaconHist.map((pair) => [beaconIndex[pair[0]].id, pair[1]]);
console.log('beaconHist', R.sortBy(R.prop(0), beaconIdsHist));

// const data2 = data.filter(item => item.beacons.length !== 0);
// // console.log(data.length);
// // console.log(data2.length);

// console.log(JSON.stringify(data2, null, '  '));
