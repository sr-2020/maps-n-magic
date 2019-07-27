import { gpx } from '@tmcw/togeojson';
import * as R from 'ramda';
import { string as gpxData } from '../data/gpxMarkers';


// console.log('gpxData', gpxData);
const oParser = new DOMParser();
const oDOM = oParser.parseFromString(gpxData, 'application/xml');
// console.log('oDOM', (oDOM));
// console.log('gpx(oDOM)', gpx(oDOM));

const parsedGpx = gpx(oDOM);

const gpxPoints = parsedGpx.features.filter(feature => feature.geometry.type === 'Point');
// console.log(gpxPoints);

const srcPoints = gpxPoints.map(gpxPoint => ({
  id: gpxPoint.properties.name,
  x: gpxPoint.geometry.coordinates[0],
  y: -gpxPoint.geometry.coordinates[1],
}));

// console.log(srcPoints);

const xs = srcPoints.map(R.prop('x'));
const ys = srcPoints.map(R.prop('y'));

// console.log(xs, ys);
const minX = Math.min.apply(null, xs);
const minY = Math.min.apply(null, ys);
const maxX = Math.max.apply(null, xs);
const maxY = Math.max.apply(null, ys);

// console.log(minX, maxX, minY, maxY);

const normilizedPoints = srcPoints.map(srcPoint => ({
  ...srcPoint,
  x: (srcPoint.x - minX) / (maxX - minX),
  y: (srcPoint.y - minY) / (maxY - minY),
}));
console.log(normilizedPoints);

export default function (x, y, width, height) {
  return normilizedPoints.map(srcPoint => ({
    ...srcPoint,
    x: srcPoint.x * width + x,
    y: srcPoint.y * height + y,
  }));
}
