const data = require('./data/rawBeaconMessages');
const { removeAllEmptyMessages } = require('./utils');

// remove all empty beacon messages
const data2 = removeAllEmptyMessages(data);
// console.log(data.length);
// console.log(data2.length);

console.log(JSON.stringify(data2, null, '  '));
