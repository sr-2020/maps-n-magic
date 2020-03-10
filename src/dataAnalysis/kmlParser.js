import R from 'ramda';
import fs from 'fs';
import path from 'path';
import togeojson from '@tmcw/togeojson';

import xmldom from 'xmldom';

const { DOMParser } = xmldom;
const { kml } = togeojson;

const fileNames = ['izumrud_socgorod'];
const dir = './data/kml';

function kmlToJson(fileName) {
  const fileContent = fs.readFileSync(path.join(dir, `${fileName}.kml`), 'utf-8');
  const oParser = new DOMParser();
  const oDOM = oParser.parseFromString(fileContent, 'application/xml');
  const parsedKml = kml(oDOM);
  console.log(parsedKml);
  fs.writeFileSync(path.join(dir, `${fileName}.json`), JSON.stringify(parsedKml, null, '  '), 'utf-8');
}

fileNames.forEach(kmlToJson);
