import { Delaunay } from 'd3-delaunay';
import * as R from 'ramda';
import { getPointMassCenter, getPerimeterMassCenter, getSolidMassCenter } from './polygonUtils';

function getPolygons(beacons, SVG_WIDTH, SVG_HEIGHT) {
  const points = beacons.map(beacon => [beacon.x, beacon.y]);
  const delaunay = Delaunay.from(points);
  const voronoi = delaunay.voronoi([0, 0, SVG_WIDTH, SVG_HEIGHT]);

  const polygons = [];
  for (const polygon of voronoi.cellPolygons()) {
    polygons.push(polygon);
    // console.log(polygon);
  }
  return {
    delaunay,
    polygons,
    beaconIds: beacons.map(R.prop('id')),
    beaconColors: beacons.map(R.prop('color')),
    polygonCenters: polygons.map(getSolidMassCenter).map((data, i) => ({
      ...data,
      id: beacons[i].id
    }))
  };
}

export default getPolygons;
