import * as R from 'ramda';

import { AvgFilter } from './AvgFilter';
import { AvgFilter2 } from './AvgFilter2';

import { getLoudestBeacon } from '../dataAnalysis/utils';

// const hasBeacon = R.pipe(R.prop('loudestBeacon'), R.isNil, R.not);
const hasBeacon = R.pipe(R.prop('beacon'), R.isNil, R.not);

export function cleanRawData({
  trackData,
  rawDataArr,
  beaconLatlngsIndex,
  filterChart,
  filterSize,
  percentUsage,
}) {
  // experiment for understanding filter influence
  // calcFilterInfluence(rawDataArr);
  const newSize = Math.floor(rawDataArr.length * (percentUsage / 100));
  let subArr = rawDataArr.slice(0, newSize);
  // const subArr = rawDataArr.slice(0, 1000);
  // const subArr = rawDataArr;
  // const subArr = rawDataArr.filter(hasBeacon);
  // const res = R.unnest(subArr.map(messageToLoudestOrEmpty(beaconLatlngsIndex)));
  if (filterChart) {
    const avgFilter2 = new AvgFilter2(filterSize);
    subArr = subArr.map(avgFilter2.filter.bind(avgFilter2));
  }
  const res = R.unnest(subArr.map(messageToAllBeaconsOrEmpty(beaconLatlngsIndex)));
  const filteredRes = res;
  // if (!filterChart) {
  //   const avgFilter = new AvgFilter(filterSize);
  //   filteredRes = res.map(avgFilter.filter.bind(avgFilter));
  // }
  const res2 = R.groupBy(R.prop('placement'), filteredRes);

  // const makeIndex = R.indexBy(R.path(['loudestBeacon', 'beaconId']));
  const makeIndex = R.indexBy(R.path(['beacon', 'beaconId']));
  const getBeaconIds = R.pipe(R.filter(hasBeacon), makeIndex, R.keys);

  // const beaconIds = getBeaconIds(res);

  return {
    res: res2,
    gpsTrack: trackData.gpsTrack,
    beaconIds: trackData.fullBeaconList,
  };
}

function calcFilterInfluence(rawDataArr) {
  console.log('no filter', 'switches', countTopLevelBeaconSwitches(rawDataArr));
  for (let i = 1; i < 30; i++) {
    const avgFilter2 = new AvgFilter2(i);
    const newArr = rawDataArr.map(avgFilter2.filter.bind(avgFilter2));
    console.log('filter size', i, 'switches', countTopLevelBeaconSwitches(newArr));
  }
}

function countTopLevelBeaconSwitches(newArr) {
  let counter = 0;
  newArr.forEach((elNext, index, arr) => {
    const elPrev = arr[index - 1];
    if (!elPrev) {
      return;
    }
    if (elPrev.beacons.length === 0 && elNext.beacons.length === 0) {
      return;
    }
    if (elPrev.beacons.length !== 0 && elNext.beacons.length !== 0) {
      const bPrev = getLoudestBeacon(elPrev.beacons);
      const bNext = getLoudestBeacon(elNext.beacons);
      counter += bPrev.beaconId !== bNext.beaconId ? 1 : 0;
      return;
    }
    counter++;
  });
  return counter;
}

function messageToLoudestOrEmpty(beaconLatlngsIndex) {
  return (el) => {
    if (el.loudestBeacon) {
      return [messageToBeacon(beaconLatlngsIndex, el, el.loudestBeacon)];
    }
    return [messageToEmpty(el)];
  };
}

function messageToAllBeaconsOrEmpty(beaconLatlngsIndex) {
  return (el) => {
    if (el.beacons.length > 0) {
      return el.beacons.map((beacon) => messageToBeacon(beaconLatlngsIndex, el, beacon));
    }
    return [messageToEmpty(el)];
  };
}

function messageToEmpty(el) {
  return {
    ...el,
    level: -120,
    beacon: null,
    placement: 'emptyMessages',
  };
}

function messageToBeacon(beaconLatlngsIndex, el, beacon) {
  return {
    ...el,
    level: beacon.level,
    beacon,
    placement: beaconLatlngsIndex[beacon.beaconId] ? 'outdoors' : 'indoors',
  };
}
