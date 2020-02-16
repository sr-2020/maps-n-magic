const { gpx } = require('@tmcw/togeojson');

const fs = require('fs');
const path = require('path');
const R = require('ramda');

const { DOMParser } = require('xmldom');

// const parse = require('csv-parse');

const fileName = 'Radomir_15_sept_2019_11_12_14';

const fileContent = fs.readFileSync(`./data/${fileName}.gpx`, 'utf-8');


const oParser = new DOMParser();
const oDOM = oParser.parseFromString(fileContent, 'application/xml');
// // console.log('oDOM', (oDOM));
// // console.log('gpx(oDOM)', gpx(oDOM));

const parsedGpx = gpx(oDOM);
fs.writeFileSync(`./data/${fileName}_raw.json`, JSON.stringify(parsedGpx, null, '  '), 'utf-8');

const feature = parsedGpx.features[0];

const { properties, geometry } = feature;
const { coordTimes } = properties;
const { coordinates } = geometry;

console.log(coordTimes[0], new Date(coordTimes[0]).getTime(), coordTimes.length);
console.log(coordinates[0], coordinates.length);

const commonArr = R.zip(coordTimes, coordinates).map(R.flatten);
const objectArr = commonArr.map(R.zipObj(['created_at', 'lng', 'lat', 'z']));
objectArr.forEach((el) => (el.timeMillis = new Date(el.created_at).getTime()));
// console.log(objectArr);


fs.writeFileSync(`./data/${fileName}.json`, JSON.stringify(objectArr, null, '  '), 'utf-8');
