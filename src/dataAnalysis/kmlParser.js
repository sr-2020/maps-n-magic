import R from 'ramda';
import fs from 'fs';
import path from 'path';
import togeojson from '@tmcw/togeojson';

import xmldom from 'xmldom';

const { DOMParser } = xmldom;
const { kml } = togeojson;

// const fileNames = ['izumrud_socgorod'];
const fileNames = ['карты Полигон Изумруд Катакомбы',
  'Полигон Изумруд - Соцгородок',
  'Технопарк разметка'];
const dir = './data/kml';

function kmlToJson(fileName) {
  const fileContent = fs.readFileSync(path.join(dir, `${fileName}.kml`), 'utf-8');
  const oParser = new DOMParser();
  const oDOM = oParser.parseFromString(fileContent, 'application/xml');
  const parsedKml = kml(oDOM);
  console.log(parsedKml);
  fs.writeFileSync(path.join(dir, `${fileName}.json`), JSON.stringify(parsedKml, null, '  '), 'utf-8');
  return parsedKml;
}

const jsons = fileNames.map(kmlToJson);

const allFeatures = R.pipe(
  R.pluck('features'),
  R.flatten,
)(jsons);

const features = R.uniq(allFeatures);

const getHistogram = R.pipe(
  R.map(R.path(['properties', 'name'])),
  R.countBy(R.identity),
  R.filter(R.lt(1)),
);

console.log('greater than 1 before filtering', getHistogram(allFeatures));
console.log('greater than 1 after filtering', getHistogram(features));


fs.writeFileSync(path.join(dir, 'aggregatedKml.json'), JSON.stringify({
  type: 'FeatureCollection',
  features,
}, null, '  '), 'utf-8');
