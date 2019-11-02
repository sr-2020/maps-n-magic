/* eslint-disable no-restricted-syntax */
import { Delaunay } from 'd3-delaunay';
import * as R from 'ramda';
import clippingUtils from 'polygon-clipping';
import {
  getPointMassCenter, getPerimeterMassCenter, getSolidMassCenter, getMultiPolygonSolidMassCenter
} from './polygonUtils';

// const clipPolygon = (first, second) => clippingUtils.intersection([first], [second])[0][0];
const clipPolygon = (first, second) => clippingUtils.intersection([first], [second]);

function getPolygons(beacons, SVG_WIDTH, SVG_HEIGHT, mainPolygon) {
  return getPolygons2(beacons, [0, 0, SVG_WIDTH, SVG_HEIGHT], mainPolygon);
}

function getPolygons2(beacons, boundingBox, mainPolygon) {
  const points = beacons.map((beacon) => [beacon.x, beacon.y]);
  const delaunay = Delaunay.from(points);
  const voronoi = delaunay.voronoi(boundingBox);

  const polygons = [];
  for (const polygon of voronoi.cellPolygons()) {
    polygons.push(polygon);
    // console.log(polygon);
  }

  const result = {
    delaunay,
    polygons,
    beaconIds: beacons.map(R.prop('id')),
    beaconColors: beacons.map(R.prop('color')),
    polygonCenters: polygons.map(getSolidMassCenter).map((data, i) => ({
      ...data,
      id: beacons[i].id
    }))
  };
  if (mainPolygon && mainPolygon.length > 1) {
    result.clippedPolygons = polygons.map((polygon, i) => clipPolygon(polygon, mainPolygon));
    // result.clippedCenters = result.clippedPolygons.map(getSolidMassCenter).map((data, i) => ({
    result.clippedCenters = result.clippedPolygons.map(getMultiPolygonSolidMassCenter).map((data, i) => ({
      ...data,
      id: beacons[i].id
    }));
  } else {
    // result.clippedPolygons = result.polygons;
    result.clippedPolygons = result.polygons.map((p) => [[p]]);
    result.clippedCenters = result.polygonCenters;
  }
  return result;
}

// export default getPolygons;
export { getPolygons, getPolygons2 };
