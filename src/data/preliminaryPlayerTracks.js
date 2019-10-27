const R = require('ramda');
const data = require('./rawBeaconMessages2');
const beaconTable = require('./beaconTable');


const beacons = [{
  name: '303434', id: 30, lat: 54.928796099562575, lng: 36.87322139652679
}, {
  name: '29', id: 29, lat: 54.92818532, lng: 36.87283511
}, {
  name: '28', id: 28, lat: 54.92859145, lng: 36.87255827
}, {
  name: '27', id: 27, lat: 54.92859604, lng: 36.87224386
}, {
  name: '26 (высокий)', id: 26, lat: 54.92853914, lng: 36.87193252
}, {
  name: '25', id: 25, lat: 54.92852877, lng: 36.87158808
}, {
  name: '24', id: 24, lat: 54.92875469, lng: 36.871699
}, {
  name: '23', id: 23, lat: 54.92897089, lng: 36.87195595
}, {
  name: '22', id: 22, lat: 54.92913163, lng: 36.87219672
}, {
  name: '21sdsd', id: 21, lat: 54.92960572532133, lng: 36.87243819280412
}];

const beaconIndex1 = R.indexBy(R.prop('id'), beacons);

const beaconTable2 = beaconTable.filter(beacon => beaconIndex1[beacon.id]).map(beacon => {
  const { lat, lng } = beaconIndex1[beacon.id];
  beacon.latlng = [lat, lng];
  return beacon;
});

const beaconIndex = R.indexBy(R.prop('bssid'), beaconTable2);

console.log(beaconIndex);


const data2 = data.filter(item => beaconIndex[item.beacons[0].bssid]);

console.log(data2);


const userTracks = data2.reduce((acc, item) => {
  if (!acc[item.user_id]) {
    acc[item.user_id] = [];
  }
  const { bssid } = item.beacons[0];
  if (acc[item.user_id].length === 0 || R.last(acc[item.user_id]) !== bssid) {
    acc[item.user_id].push(bssid);
  }
  return acc;
}, {});

const userTracks2 = R.map(arr => arr.map(bssid => beaconIndex[bssid].latlng), userTracks);

// console.log(userTracks2);
console.log(JSON.stringify(userTracks2, null, '  '));
