// build user tracks with all available information
// const R = require('ramda');
import R from 'ramda';
import fs from 'fs';

// // const fs = require('fs');
import {
  beaconIndex, beaconLatlngsIndex, countElsByType, calcDataBeaconStats,
  getBeaconsListFromData,
} from './beaconUtils';

import {
  getTimeLimits, getLoudestBeacon,
} from './utils';
import {
  AvgFilter2,
} from '../utils/AvgFilter2';
// // const data = require('./data/rawBeaconMessages_improved');
// // const rawData = require('./data/rawBeaconMessages');
// const rawData = require('./data/rawBeaconMessages2');
// const usersData = require('./data/usersData');
import rawData from './data/restOfAll/rawBeaconMessages2.json';
import usersData from './data/restOfAll/usersData.json';

import {
  improveData, groupDataByUser,
} from './improveRawData';

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

// const messagesByUser = R.groupBy(R.prop('user_id'), improvedData);

const messagesByUser = groupDataByUser(improvedData);

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

const isNotEmpty = R.pipe(R.isEmpty, R.not);
const echo = R.curry((message, arg) => {
  console.log(message, arg);
  return arg;
});
const echoText = R.curry((message, arg) => {
  console.log(message);
  return arg;
});
const echoTextProp = R.curry((message, func, arg) => {
  console.log(message, func(arg));
  return arg;
});

const getTimeMillisRepetitionList = R.pipe(
  // echo('before aperture'),
  R.aperture(2), // generate pairs
  R.filter(R.apply(R.eqBy(R.prop('timeMillis')))), // filter out pair with time repetition
  // echo,
  R.map( // extract repetition times to arr
    R.pipe(
      R.nth(0),
      R.prop('timeMillis'),
    ),
  ),
);

R.pipe(
  R.toPairs,
  R.forEach(([userName, { tracks, rawDataArr }]) => {
    R.pipe(
      // echoTextProp('before filter', R.length),
      // R.filter(R.pipe(R.length, R.lt(1))),
      // echoTextProp('after filter', R.length),
      R.map(getTimeMillisRepetitionList),
      R.flatten,
      R.when(isNotEmpty,
        echo(`userName time repetitions in tracks ${userName}`)),
    )(tracks);
    R.pipe(
      // echoTextProp('before filter', R.length),
      // R.filter(R.pipe(R.length, R.lt(1))),
      // echoTextProp('after filter', R.length),
      getTimeMillisRepetitionList,
      // R.flatten,
      R.when(isNotEmpty,
        echo(`userName time repetitions in rawDataArr ${userName}`)),
    )(rawDataArr);
  }),
)(userTracks);

// exports.userTracks = userTracks;

fs.writeFileSync('./data/preparedData/pt6.json', JSON.stringify(userTracks, null, '  '), 'utf-8');

// // calcDataBeaconStats(data);
