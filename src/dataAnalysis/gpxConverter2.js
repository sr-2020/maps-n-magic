const { gpx } = require('@tmcw/togeojson');

const fs = require('fs');
const path = require('path');
const R = require('ramda');

const { DOMParser } = require('xmldom');

// const parse = require('csv-parse');

const radomirFile = 'Radomir_15_sept_2019_11_12_14';
const ksotarFiles = [
  'Ksotar_15_sept_2019_10_10_50_AM',
  'Ksotar_15_sept_2019_10_40_56_AM',
  'Ksotar_15_sept_2019_11_24_23_AM',
  'Ksotar_15_sept_2019_12_36_39_PM',
];

// parseGpxFromFile(radomirFile);

const makeKsotarObjectArr = R.pipe(
  R.map(parseGpxFromFile),
  R.pluck('objectArr'),
  R.reduce(R.concat, []),
);
const ksotarObjectArr = makeKsotarObjectArr(ksotarFiles);
// console.log(ksotarObjectArr);
fs.writeFileSync('./data/Ksotar_gps_15_sept.json', JSON.stringify(ksotarObjectArr, null, '  '), 'utf-8');

function parseGpxFromFile(fileName) {
  const fileContent = fs.readFileSync(`./data/${fileName}.gpx`, 'utf-8');
  const parseResult = parseGpx(fileContent);
  const { parsedGpx, objectArr } = parseResult;

  fs.writeFileSync(`./data/${fileName}_raw.json`, JSON.stringify(parsedGpx, null, '  '), 'utf-8');
  fs.writeFileSync(`./data/${fileName}.json`, JSON.stringify(objectArr, null, '  '), 'utf-8');
  return parseResult;
}

function parseGpx(gpxFileContent) {
  const oParser = new DOMParser();
  const oDOM = oParser.parseFromString(gpxFileContent, 'application/xml');
  // // console.log('oDOM', (oDOM));
  // // console.log('gpx(oDOM)', gpx(oDOM));

  const parsedGpx = gpx(oDOM);


  const feature = parsedGpx.features[0];

  const { properties, geometry } = feature;
  const { coordTimes } = properties;
  const { coordinates } = geometry;

  console.log(coordTimes[0], new Date(coordTimes[0]).getTime(), coordTimes.length);
  console.log(coordinates[0], coordinates.length);

  const commonArr = R.zip(coordTimes, coordinates).map(R.flatten);
  const objectArr = commonArr.map(R.zipObj(['created_at', 'lng', 'lat', 'z']));
  objectArr.forEach((el) => (el.timeMillis = new Date(el.created_at).getTime()));
  return {
    parsedGpx,
    objectArr,
  };
}
// console.log(objectArr);
