import R from 'ramda';


import beaconTable from './data/postgresBeaconTable.json';
import beaconLatlngs from './data/googleMapBeaconList.json';

// console.log(R);

// const R = require('ramda');
// const beaconTable = require('./data/postgresBeaconTable');
// const beaconLatlngs = require('./data/googleMapBeaconList');

console.log('beaconTable.length', beaconTable.length);

// console.log(JSON.stringify(beacons));

export const beaconLatlngsIndex = R.indexBy(R.prop('id'), beaconLatlngs);

const beaconTable2 = beaconTable.filter((beacon) => beaconLatlngsIndex[beacon.id]).map((beacon) => {
  const { lat, lng } = beaconLatlngsIndex[beacon.id];
  beacon.latlng = [lat, lng];
  return beacon;
});

export const beaconIndex = R.indexBy(R.prop('bssid'), beaconTable2);

// console.log(beaconIndex);

export const bssid2id = beaconTable.reduce((acc, beacon) => {
  acc[beacon.bssid] = beacon.id;
  return acc;
}, {});

// console.log('bssid2id', bssid2id);

export const calcDataBeaconStats = function (data) {
  const rawBssidList = R.flatten(data.map((item) => item.beacons.map(R.prop('bssid'))));

  const frequencyOfIds = rawBssidList.map((bssid) => bssid2id[bssid]).reduce((acc, id) => {
    if (acc[id] === undefined) {
      acc[id] = 0;
    }
    acc[id]++;
    return acc;
  }, {});

  console.log('frequencyOfIds', frequencyOfIds);

  const meetsBssid = R.uniq(rawBssidList);
  console.log('meetsBssid', meetsBssid);

  const bssid2idSubset = R.pick(meetsBssid, bssid2id);
  console.log('bssid2idSubset', bssid2idSubset);

  const id2bssid = R.invertObj(bssid2idSubset);
  console.log('id2bssid', id2bssid);

  const coordKnowledge = R.groupBy((id) => (beaconLatlngsIndex[id] ? 'known' : 'unknown'), R.keys(id2bssid));
  console.log('coordKnowledge', coordKnowledge);

  console.log('Beacons with unknown coordinates meets these number of times', R.pick(coordKnowledge.unknown, frequencyOfIds));
  console.log('Beacons with known coordinates meets these number of times', R.pick(coordKnowledge.known, frequencyOfIds));
};

export function resolveBssidToId(bssid2id2, beacons) {
  const unknownMacAddresses = {};
  const result = beacons.filter((beacon) => {
    if (!bssid2id2[beacon.bssid]) {
      unknownMacAddresses[beacon.bssid] = true;
      return false;
    }
    return true;
  }).map((beacon) => ({
    ...beacon,
    beaconId: bssid2id2[beacon.bssid],
  }));

  if (R.keys(unknownMacAddresses).length > 0) {
    console.warn('Unknown mac addresses', R.keys(unknownMacAddresses));
  }

  return result;
}

const sumBy = R.reduceBy(R.inc, 0);

export const countElsByType = sumBy((el) => {
  if (el.loudestBeacon === null) {
    return 'emptyMessages';
  }
  if (!beaconLatlngsIndex[el.loudestBeacon.beaconId]) {
    return 'unknownBeaconLatlngs';
  }
  return 'knownBeaconLatlngs';
});

export function getBeaconsListFromData(arr) {
  const beaconIdList = arr.reduce((acc, el) => {
    const beaconsIds = el.beacons.map(R.prop('beaconId'));
    if (beaconsIds.includes(undefined)) {
      throw new Error(JSON.stringify(el));
    }
    acc = R.union(acc, beaconsIds);
    return acc;
  }, []);
  return R.sortBy(Number, beaconIdList);
}
