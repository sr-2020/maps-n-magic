const R = require('ramda');
const data = require('./rawBeaconMessages_notEmpty');
const beaconTable = require('./beaconTable');


const beacons = [{
  name: '20', id: 20, lat: 54.92911031, lng: 36.87308021,
}, {
  name: '19', id: 19, lat: 54.92891442, lng: 36.87266958,
}, {
  name: '15', id: 15, lat: 54.92874583, lng: 36.8729209,
}, {
  name: '14', id: 14, lat: 54.92878868, lng: 36.87238332,
}, {
  name: '13', id: 13, lat: 54.92907017, lng: 36.87242461,
}, {
  name: '12', id: 12, lat: 54.92939312, lng: 36.87216967,
}, {
  name: '30', id: 30, lat: 54.92837799, lng: 36.87314019,
}, {
  name: '29', id: 29, lat: 54.92818532, lng: 36.87283511,
}, {
  name: '28', id: 28, lat: 54.92859145, lng: 36.87255827,
}, {
  name: '27', id: 27, lat: 54.92859604, lng: 36.87224386,
}, {
  name: '26 (высокий)', id: 26, lat: 54.92853914, lng: 36.87193252,
}, {
  name: '25', id: 25, lat: 54.92852877, lng: 36.87158808,
}, {
  name: '24', id: 24, lat: 54.92875469, lng: 36.871699,
}, {
  name: '23', id: 23, lat: 54.92897089, lng: 36.87195595,
}, {
  name: '22', id: 22, lat: 54.92913163, lng: 36.87219672,
}, {
  name: '21', id: 21, lat: 54.92965521, lng: 36.87236735,
}];


const beaconIndex1 = R.indexBy(R.prop('id'), beacons);

const beaconTable2 = beaconTable.filter((beacon) => beaconIndex1[beacon.id]).map((beacon) => {
  const { lat, lng } = beaconIndex1[beacon.id];
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


const rawBssidList = R.flatten(data.map((item) => item.beacons.map(R.prop('bssid'))));

const frequencyOfIds = rawBssidList.map((bssid) => bssid2id[bssid]).reduce((acc, id) => {
  if (acc[id] === undefined) {
    acc[id] = 0;
  }
  acc[id]++;
  return acc;
}, {});

// console.log('frequencyOfIds', frequencyOfIds);

const meetsBssid = R.uniq(rawBssidList);

// console.log('meetsBssid', meetsBssid);

const bssid2idSubset = R.pick(meetsBssid, bssid2id);

// console.log('bssid2idSubset', bssid2idSubset);

const id2bssid = R.invertObj(bssid2idSubset);

// console.log('id2bssid', id2bssid);

const coordKnowledge = R.groupBy((id) => (beaconIndex1[id] ? 'known' : 'unknown'), R.keys(id2bssid));

// console.log('coordKnowledge', coordKnowledge);

// console.log('Beacons with unknown coordinates meets these number of times', R.pick(coordKnowledge.unknown, frequencyOfIds));
// console.log('Beacons with known coordinates meets these number of times', R.pick(coordKnowledge.known, frequencyOfIds));


function getClosestBeacon(beaconsArr) {
  if (beaconsArr.length === 1) {
    return beaconsArr[0];
  }
  return beaconsArr.reduce((closest, beacon) => (closest.level > beacon.level ? closest : beacon), beaconsArr[0]);
}

// const data2 = data.filter((item) => beaconIndex[item.beacons[0].bssid]);

// const data2 = data.filter((item) => beaconIndex[getClosestBeacon(item.beacons).bssid]);
const data2 = data.map((item) => ({
  ...item,
  beacon: getClosestBeacon(item.beacons),
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

// console.log(userTracks);
// const userTracks2 = R.map((arr) => arr.map((bssid) => beaconIndex[bssid].latlng), userTracks);

// // console.log(userTracks2);
// console.log(JSON.stringify(userTracks2, null, '  '));
console.log(JSON.stringify({
  beaconIndex: beaconIndex1,
  userTracks: userTracks2,
}, null, '  '));
