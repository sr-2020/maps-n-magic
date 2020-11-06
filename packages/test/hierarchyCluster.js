const R = require('ramda');

console.log(R);

const points = [
  { x: 0, y: 0 }, // 0
  { x: 1, y: 0 }, // 1
  { x: 4, y: 4 }, // 2
  { x: 5, y: 4 }, // 3
  { x: 3, y: 0 }, // 4
];

function dist(p1, p2) {
  return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
}

const arr = [];
points.forEach((pt1, i) => {
  points.forEach((pt2, j) => {
    if (j <= i) {
      return;
    }
    arr.push({
      key: `${i}${j}`, key1: `${i}`, key2: `${j}`, dist: dist(pt1, pt2),
    });
  });
});

const arr2 = R.sortBy(R.prop('dist'), arr);
console.log(arr2);

let clusterIndex = {};
points.forEach((pt, i) => (clusterIndex[i] = i));
console.log(clusterIndex);

const selectedDists = [];
arr2.forEach(((el) => {
// const el = arr2[0];
  const { key1, key2 } = el;
  const clusterId1 = clusterIndex[key1];
  const clusterId2 = clusterIndex[key2];
  if (clusterId1 !== clusterId2) {
    selectedDists.push(el);
    clusterIndex = R.mapObjIndexed((value) => (value === clusterId2 ? clusterId1 : value), clusterIndex);
    console.log('-------');
    console.log(selectedDists, clusterIndex);
  }
}));
