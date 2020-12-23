// excludes empty messages, ignore beacons with unknown coords and build user tracks
const R = require('ramda');
const { beaconIndex, bssid2idSubset } = require('./beaconUtils');
const { getLoudestBeacon } = require('./utils');
const data = require('./data/restOfAll/rawBeaconMessages_notEmpty');
// const data = require('./rawBeaconMessages');

// const data2 = data.filter((item) => beaconIndex[item.beacons[0].bssid]);

// const data2 = data.filter((item) => beaconIndex[getClosestBeacon(item.beacons).bssid]);
const data2 = data.map((item) => ({
  ...item,
  beacon: getLoudestBeacon(item.beacons),
})).filter((item) => beaconIndex[item.beacon.bssid]);

// console.log(data2);
// console.log(JSON.stringify(data2, null, '  '));

const userTracks = data2.reduce((acc, item) => {
  if (!acc[item.user_id]) {
    acc[item.user_id] = [];
  }
  // const { bssid } = item.beacons[0];
  const { bssid } = item.beacon;
  if (acc[item.user_id].length === 0 || R.last(acc[item.user_id]) !== bssid) {
    acc[item.user_id].push({
      id: bssid2idSubset[bssid],
      bssid,
      latlng: beaconIndex[bssid].latlng,
      time: item.created_at,
    });
  }
  return acc;
}, {});

const sortByTime = R.sortBy((item) => new Date(item.time));

const filterRepetitions = function (arr) {
  const acc2 = arr.reduce((acc, el) => {
    // if (acc.curEl === null || acc.curEl.id !== el.id) {
    // if (acc.curEl === null) {
    acc.newArr.push(el);
    acc.curEl = el;
    // }
    return acc;
  }, {
    newArr: [],
    curEl: null,
  });
  return acc2.newArr;
};

const userTracks2 = R.mapObjIndexed(R.pipe(sortByTime, filterRepetitions), userTracks);

exports.userTracks = userTracks2;

// console.log(userTracks);
// const userTracks2 = R.map((arr) => arr.map((bssid) => beaconIndex[bssid].latlng), userTracks);
