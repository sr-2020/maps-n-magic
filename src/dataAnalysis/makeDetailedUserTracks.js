// build user tracks with all available information
// const R = require('ramda');
import R from 'ramda';
import fs from 'fs';

// // const fs = require('fs');
import {
  beaconIndex, beaconLatlngsIndex, countElsByType, calcDataBeaconStats,
  getBeaconsListFromData,
} from './beaconUtils.js';

import {
  getTimeLimits, getLoudestBeacon,
} from './utils.js';
import {
  AvgFilter2,
} from '../dataUtils/AvgFilter2.js';
// // const data = require('./data/rawBeaconMessages_improved');
// // const rawData = require('./data/rawBeaconMessages');
// const rawData = require('./data/rawBeaconMessages2');
// const usersData = require('./data/usersData');
import rawData from './data/rawBeaconMessages2.json';
import usersData from './data/usersData.json';

import {
  improveData, groupDataByUser,
} from './improveRawData.js';

const improvedData = improveData(rawData, 60000 * 60 * 3);

const countDeltas = (arr) => R.aperture(2, arr).map(([p1, p2]) => p2.timeMillis - p1.timeMillis);
const hist = R.pipe(countDeltas, R.groupBy(R.identity), R.mapObjIndexed((value) => value.length));

const countStats = function (data2) {
  const total = data2.length;
  const messageIntervalHist = hist(data2);
  const avgSource = R.toPairs(messageIntervalHist).reduce((acc, pair) => {
    // if (Number(pair[0]) > 60000) { // ignore delta more than minute
    //   return acc;
    // }
    acc.meausureNumber += pair[1];
    acc.multiplication += Number(pair[0]) * pair[1];
    return acc;
  }, {
    meausureNumber: 0,
    multiplication: 0,
  });
  const avgMessageInterval = avgSource.multiplication / avgSource.meausureNumber;
  const stats = {
    ...countElsByType(data2),
    ...getTimeLimits(data2),
    messageIntervalHist,
    avgMessageInterval,
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

const overallStats = countStats(improvedData);
console.log(overallStats);

const messagesByUser = R.groupBy(R.prop('user_id'), improvedData);

groupDataByUser(improvedData);

// exports.userTracks = userTracks;

const hasBeaconLatlngs = (beaconId) => !!beaconLatlngsIndex[beaconId];

const getNoise = () => (Math.random() - 0.5) / 20000;

const dataArrToTracks = function (dataArr) {
  const avgFilter = new AvgFilter2(20, 60000, 'extrapolate');
  // subArr = subArr.map(avgFilter2.filter.bind(avgFilter2));
  return dataArr
    .map(avgFilter.filter.bind(avgFilter))
    .map((el) => ({
      ...el,
      loudestBeacon: getLoudestBeacon(el.beacons),
    }))
    .reduce((acc, el) => {
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


// console.log(messagesByUser['5'].map(R.prop('timeMillis')));

// const deltas = countDeltas(messagesByUser['5']);
// console.log(deltas);
// // console.log(R.groupBy(R.identity, deltas));
// console.log(hist(deltas));
// const res = dataArrToTracks(messagesByUser['5']);
// console.log(res, res.tracks.length);
// console.log(JSON.stringify(res, null, '  '));

const fullBeaconList = getBeaconsListFromData(improvedData);

// console.log(getBeaconsListFromData(improvedData));

export const userTracks = R.mapObjIndexed((dataArr, key) => ({
  userData: {
    id: Number(key),
    ...usersData[key],
  },
  stats: countStats(dataArr),
  fullBeaconList,
  userBeaconList: getBeaconsListFromData(dataArr),
  tracks: dataArrToTracks(dataArr).tracks,
  rawDataArr: dataArr,
}), messagesByUser);

// console.log(JSON.stringify(userTracks, null, '  '));
// console.log(JSON.stringify(R.keys(userTracks), null, '  '));


// exports.userTracks = userTracks;

fs.writeFileSync('./data/pt6.json', JSON.stringify(userTracks, null, '  '), 'utf-8');


// // calcDataBeaconStats(data);
