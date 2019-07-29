const polygonClipping = require('polygon-clipping');

const poly1 = [[[0, 0], [2, 0], [0, 2], [0, 0]]];
const poly2 = [[[-1, 0], [1, 0], [0, 1], [-1, 0]]];

// polygonClipping.union       (poly1, poly2 /* , poly3, ... */)
const res = polygonClipping.intersection(poly1, poly2 /* , poly3, ... */);
console.log(JSON.stringify(res));
// polygonClipping.xor         (poly1, poly2 /* , poly3, ... */)
// polygonClipping.difference  (poly1, poly2 /* , poly3, ... */)
