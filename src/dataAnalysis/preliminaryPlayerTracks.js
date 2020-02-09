
const { userTracks } = require('./makeCleanUserTracks');

// // console.log(userTracks2);
// console.log(JSON.stringify(userTracks2, null, '  '));
console.log(JSON.stringify({
  // beaconIndex: beaconIndex1,
  userTracks,
}, null, '  '));
