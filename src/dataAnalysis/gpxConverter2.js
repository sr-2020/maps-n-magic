const { gpx } = require('@tmcw/togeojson');

const fs = require('fs');
const path = require('path');
const R = require('ramda');

const { DOMParser } = require('xmldom');

const dir = './data/gps_15_sept';

const files = [{
  fileName: 'Eremin_sync_Ksotar_11_25_51_AM',
  shortName: 'Eremin_sync_Ksotar',
  offset: 0,
}, {
  fileName: 'Girt_11_11_41',
  shortName: 'Girt',
  offset: 0,
}, {
  fileName: 'Gurkalov_sync_Ksotar_11_25_22',
  shortName: 'Gurkalov_sync_Ksotar',
  offset: 0,
}, {
  fileName: 'Ksotar_15_sept_2019_10_10_50_AM',
  offset: 0,
}, {
  fileName: 'Ksotar_15_sept_2019_10_40_56_AM',
  offset: 0,
}, {
  fileName: 'Ksotar_15_sept_2019_11_24_23_AM',
  offset: 0,
}, {
  fileName: 'Ksotar_15_sept_2019_12_36_39_PM',
  offset: 0,
}, {
//   fileName: 'Mehlvin_14-09-2019', // not a track - this is a set points, no time data
//   offset: 0,
// }, {
//   fileName: 'Pchel_14_sept_18_20_43_1568480554402', // 14 sept
//   offset: 0,
// }, {
  fileName: 'Radomir_11_12_14',
  shortName: 'Radomir',
  offset: 0,
// }, {
//   fileName: 'Radomir_14_sept_2019_г._18_20_49_1568479724061', // 14 sept
//   offset: 0,
// }, {
//   fileName: 'Urfin_14_sept_18_30_12', // 14 sept
//   offset: 0,
}];

const ksotarFiles = [
  'Ksotar_15_sept_2019_10_10_50_AM',
  'Ksotar_15_sept_2019_10_40_56_AM',
  'Ksotar_15_sept_2019_11_24_23_AM',
  'Ksotar_15_sept_2019_12_36_39_PM',
];
const ksotarCommonFile = 'Ksotar_gps_15_sept';

files.forEach(({ fileName, offset }) => parseGpxFromFile(fileName));
concatKsotarTracks(ksotarCommonFile);

const fileList = [...files.filter((el) => !!el.shortName), {
  fileName: ksotarCommonFile,
  shortName: 'Ksotar',
}];

const indexImportContent = fileList.map(({ fileName, shortName }) => `import ${shortName} from './json/${fileName}.json';`).join('\n');
const indexExportContent = `\n\nexport { ${R.pluck('shortName', fileList).join(', ')} };`;

fs.writeFileSync(path.join(dir, 'index.js'), indexImportContent + indexExportContent, 'utf-8');

// const allJsons = R.concat(R.pluck('fileName', files), [ksotarCommonFile]);

// R.map((fileName) => path.join(dir, 'json', `${fileName}.json`), allJsons).join;

function concatKsotarTracks(fileName) {
  const readFile = (fileName2) => fs.readFileSync(path.join(dir, 'json', `${fileName2}.json`), 'utf-8');
  const makeKsotarObjectArr = R.pipe(
    R.map(readFile),
    R.map(JSON.parse),
    // R.pluck('objectArr'),
    R.reduce(R.concat, []),
  );
  const ksotarObjectArr = makeKsotarObjectArr(ksotarFiles);
  fs.writeFileSync(path.join(dir, 'json', `${fileName}.json`), JSON.stringify(ksotarObjectArr, null, '  '), 'utf-8');
}

function parseGpxFromFile(fileName) {
  console.log('Parsing', fileName);
  const fileContent = fs.readFileSync(path.join(dir, 'gpx', `${fileName}.gpx`), 'utf-8');
  const parseResult = parseGpx(fileContent);
  const { parsedGpx, objectArr } = parseResult;

  fs.writeFileSync(path.join(dir, 'rawJson', `${fileName}_raw.json`), JSON.stringify(parsedGpx, null, '  '), 'utf-8');
  fs.writeFileSync(path.join(dir, 'json', `${fileName}.json`), JSON.stringify(objectArr, null, '  '), 'utf-8');
  return parseResult;
}

function parseGpx(gpxFileContent) {
  const oParser = new DOMParser();
  const oDOM = oParser.parseFromString(gpxFileContent, 'application/xml');
  // // console.log('oDOM', (oDOM));
  // // console.log('gpx(oDOM)', gpx(oDOM));

  const parsedGpx = gpx(oDOM);


  const feature = parsedGpx.features[0];

  console.log(JSON.stringify(parsedGpx, null, '  '));

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
