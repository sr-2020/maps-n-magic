const R = require('ramda');
const beaconTable = require('./data/postgresBeaconTable');
const beaconLatlngs = require('./data/googleMapBeaconList');

// console.log(JSON.stringify(beacons));

const beaconLatlngsIndex = R.indexBy(R.prop('id'), beaconLatlngs);

const beaconTable2 = beaconTable.filter((beacon) => beaconLatlngsIndex[beacon.id]).map((beacon) => {
  const { lat, lng } = beaconLatlngsIndex[beacon.id];
  beacon.latlng = [lat, lng];
  return beacon;
});

const beaconIndex = R.indexBy(R.prop('bssid'), beaconTable2);

// console.log(beaconIndex);

const bssid2id = beaconTable.reduce((acc, beacon) => {
  acc[beacon.bssid] = beacon.id;
  return acc;
}, {});

// console.log('bssid2id', bssid2id);

exports.calcDataBeaconStats = function (data) {
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

function resolveBssidToId(bssid2id2, beacons) {
  return beacons.map((beacon) => ({
    ...beacon,
    beaconId: bssid2id2[beacon.bssid],
  }));
}

const sumBy = R.reduceBy(R.inc, 0);

const countElsByType = sumBy((el) => {
  if (el.loudestBeacon === null) {
    return 'emptyMessages';
  }
  if (!beaconLatlngsIndex[el.loudestBeacon.beaconId]) {
    return 'unknownBeaconLatlngs';
  }
  return 'knownBeaconLatlngs';
});

exports.beaconIndex = beaconIndex;
exports.bssid2idSubset = bssid2id;
exports.bssid2id = bssid2id;
exports.resolveBssidToId = resolveBssidToId;
exports.beaconLatlngsIndex = beaconLatlngsIndex;
exports.countElsByType = countElsByType;
