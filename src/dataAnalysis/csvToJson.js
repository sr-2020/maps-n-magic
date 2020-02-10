const fs = require('fs');
const path = require('path');

const parse = require('csv-parse');

const fileContent = fs.readFileSync('./data/rawBeaconMessages2.csv', 'utf-8');
parse(fileContent, {
  cast(value, context) {
    if (context.column === 'beacons') {
      return JSON.parse(value);
    }
    return value;
  },
  // comment: '#'
  columns: true,
}, (err, output) => {
  console.log(output);
  fs.writeFileSync('./data/rawBeaconMessages2.json', JSON.stringify(output, null, '  '), 'utf-8');
  // assert.deepEqual(
  //   output,
  //   [ [ '1', '2', '3', '4' ], [ 'a', 'b', 'c', 'd' ] ]
  // )
});
