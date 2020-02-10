// build user tracks with all available information
const R = require('ramda');
const fs = require('fs');
const {
  beaconIndex, bssid2idSubset, beaconLatlngsIndex, countElsByType,
} = require('./beaconUtils');
const { getTimeLimits } = require('./utils');
// const data = require('./data/rawBeaconMessages_improved');
// const rawData = require('./data/rawBeaconMessages');
const rawData = require('./data/rawBeaconMessages2');
const usersData = require('./data/usersData');

const data = require('./improveRawData').improveData(rawData);

const countStats = function (data2) {
  const total = data2.length;
  const stats = {
    ...countElsByType(data2),
    ...getTimeLimits(data2),
    total,
  };
  stats.emptyMessages = stats.emptyMessages || 0;
  stats.unknownBeaconLatlngs = stats.unknownBeaconLatlngs || 0;
  stats.knownBeaconLatlngs = stats.knownBeaconLatlngs || 0;
  stats.emptyMessagesFraction = stats.emptyMessages / total;
  stats.unknownBeaconLatlngsFraction = stats.unknownBeaconLatlngs / total;
  stats.knownBeaconLatlngsFraction = stats.knownBeaconLatlngs / total;
  return stats;
};

const overallStats = countStats(data);
console.log(overallStats);

const messagesByUser = R.groupBy(R.prop('user_id'), data);


// exports.userTracks = userTracks;

const hasBeaconLatlngs = (beaconId) => !!beaconLatlngsIndex[beaconId];

const getNoise = () => (Math.random() - 0.5) / 20000;

const dataArrToTracks = function (dataArr) {
  return dataArr.reduce((acc, el) => {
    if (el.loudestBeacon === null) {
      if (acc.curTrack != null) {
        acc.curTrack = null;
      }
    } else if (!hasBeaconLatlngs(el.loudestBeacon.beaconId)) {
      // do nothing if we don't know latlng of beacon
    } else {
      const beaconData = beaconLatlngsIndex[el.loudestBeacon.beaconId];
      if (acc.curTrack === null) {
        acc.curTrack = [];
        acc.tracks.push(acc.curTrack);
      }
      acc.curTrack.push({
        ...el,
        lat: beaconData.lat + getNoise(),
        lng: beaconData.lng + getNoise(),
      });
    }
    return acc;
  }, {
    tracks: [],
    curTrack: null,
  });
};

// console.log(messagesByUser['5']);
// const res = dataArrToTracks(messagesByUser['5']);
// console.log(res, res.tracks.length);
// console.log(JSON.stringify(res, null, '  '));

const userTracks = R.mapObjIndexed((dataArr, key) => ({
  userData: usersData[key] || null,
  stats: countStats(dataArr),
  // rawDataArr: dataArr,
  tracks: dataArrToTracks(dataArr).tracks,
}), messagesByUser);

// console.log(JSON.stringify(userTracks, null, '  '));
console.log(JSON.stringify(R.keys(userTracks), null, '  '));

exports.userTracks = userTracks;

fs.writeFileSync('./data/pt6.json', JSON.stringify(userTracks, null, '  '), 'utf-8');
