const { Delaunay } = require('d3-delaunay');
const beacons = require('./beacons.json');

console.log(Delaunay);

const SVG_WIDTH = 500;
const SVG_HEIGHT = 400;

const imageCenter = {
  x: SVG_WIDTH / 2,
  y: SVG_HEIGHT / 2,
};

const beaconCenter = beacons.reduce((acc, beacon) => {
  acc.x += beacon.x;
  acc.y += beacon.y;
  return acc;
}, { x: 0, y: 0 });

beaconCenter.x /= beacons.length;
beaconCenter.y /= beacons.length;

const correctedBeacons = beacons.map((beacon) => ({
  x: beacon.x + imageCenter.x - beaconCenter.x,
  y: beacon.y + imageCenter.y - beaconCenter.y
}));


const points = correctedBeacons.map((beacon) => [beacon.x, beacon.y]);
// const points = [[0, 0], [0, 1], [1, 0], [1, 1]];
const delaunay = Delaunay.from(points);
const voronoi = delaunay.voronoi([0, 0, SVG_WIDTH, SVG_HEIGHT]);

// eslint-disable-next-line no-restricted-syntax
for (const polygon of voronoi.cellPolygons()) {
  // alert(value); // 1, затем 2
  console.log(polygon);
}

console.log(voronoi.circumcenters);
