const data = require('./rawBeaconMessages');

const data2 = data.filter((item) => item.beacons.length !== 0);
// console.log(data.length);
// console.log(data2.length);

console.log(JSON.stringify(data2, null, '  '));
