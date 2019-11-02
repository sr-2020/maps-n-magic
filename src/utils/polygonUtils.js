//http://e-maxx.ru/algo/gravity_center
import * as R from 'ramda';
import * as gpu from '@thi.ng/geom-poly-utils';

// by points
function getPointMassCenter(polygon) {
  const sums = polygon.reduce((acc, point) => {
    acc[0] += point[0];
    acc[1] += point[1];
    return acc;
  }, [0, 0]);
  return {
    x: sums[0] / polygon.length,
    y: sums[1] / polygon.length,
  };
}
const dist = (arr1, arr2) => Math.sqrt((arr1[0] - arr2[0]) * (arr1[0] - arr2[0]) + (arr1[1] - arr2[1]) * (arr1[1] - arr2[1]));
// by edges
function getPerimeterMassCenter(polygon) {
  const polygon2 = polygon.map((pair, i) => {
    if (i < polygon.length - 1) {
      return [(pair[0] + polygon[i + 1][0]) / 2, (pair[1] + polygon[i + 1][1]) / 2, dist(pair, polygon[i + 1])];
    }
    return [(pair[0] + polygon[0][0]) / 2, (pair[1] + polygon[0][1]) / 2, dist(pair, polygon[0])];
  });
  const sums = polygon2.reduce((acc, point) => {
    acc[0] += point[0] * point[2];
    acc[1] += point[1] * point[2];
    return acc;
  }, [0, 0]);
  const perimeter = R.sum(polygon2.map((p) => p[2]));
  return {
    x: sums[0] / perimeter,
    y: sums[1] / perimeter,
  };
}

function getTriangleArea(triangle) {
  const a = dist(triangle[0], triangle[1]);
  const b = dist(triangle[0], triangle[2]);
  const c = dist(triangle[1], triangle[2]);
  const p = (a + b + c) / 2;
  const S = Math.sqrt(p * (p - a) * (p - b) * (p - c));
  return S;
}

// result is the same as for getPointMassCenter
function getTriangleCentroid(triangle) {
  const pt1 = triangle[0];
  const pt2 = [(triangle[1][0] + triangle[2][0]) / 2, (triangle[1][1] + triangle[2][1]) / 2];

  return {
    x: ((pt2[0] - pt1[0]) * 2) / 3 + pt1[0],
    y: ((pt2[1] - pt1[1]) * 2) / 3 + pt1[1],
    pt1,
    pt2
  };
}

function getMultiPolygonSolidMassCenter(multiPolygon) {
  const intermediate = R.flatten(multiPolygon.map((polygon) => polygon.map((ring) => ({
    ...getSolidMassCenter(ring),
  }))));
  // const intermediate = polygons.map((polygon, i) => ({
  //   ...getSolidMassCenter(polygon),
  //   // volume: getTriangleArea(triangle)
  // }));
  return intermediate2massCenter(intermediate);
}

function getSolidMassCenter(polygon) {
  // // first version - take one polygon point as triangle basis
  // // const pt1 = polygon[0];
  // // const triangles = R.aperture(2, R.tail(polygon)).map(R.concat([pt1]));

  // // second version - take some simple mass center as triangle basis
  // // const massCenter = getPointMassCenter(polygon);
  // const massCenter = getPerimeterMassCenter(polygon);
  // const pt1 = [massCenter.x, massCenter.y];
  // const triangles = R.aperture(2, polygon).map(R.concat([pt1]));


  // // console.log(polygon);
  // // console.log(triangles);
  // // triangle = [[3,0],[0,0],[0,5]];
  // const intermediate = triangles.map((triangle, i) => ({
  //   ...getPointMassCenter(triangle),
  //   volume: getTriangleArea(triangle)
  // }));
  // const area1 = R.sum(intermediate.map(R.prop('volume')));
  const area2 = gpu.polyArea2(polygon);
  const weightCenter = gpu.centerOfWeight2(polygon);
  // // gpu
  // // console.log(area1, area2);
  // console.log('gpu', area2, weightCenter);
  // // console.log(intermediate);
  // // return
  // const tmp = intermediate2massCenter(intermediate);
  // console.log('old result', tmp);
  // // return tmp;
  return {
    x: weightCenter[0],
    y: weightCenter[1],
    volume: area2
  };
}

function intermediate2massCenter(intermediate) {
  const volume = R.sum(intermediate.map(R.prop('volume')));
  const sums = intermediate.reduce((acc, point) => {
    acc[0] += point.x * point.volume;
    acc[1] += point.y * point.volume;
    return acc;
  }, [0, 0]);
  return {
    x: sums[0] / volume,
    y: sums[1] / volume,
    volume
  };
}

const polygon2polyline = (polygon) => (polygon ? polygon.map((pt) => pt.join(',')).join(' ') : '');

const euDist = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));

const getBoundingRect = (polygon) => polygon.reduce((acc, point) => {
  const [y, x] = point;
  acc.left = acc.left > x ? x : acc.left;
  acc.right = acc.right < x ? x : acc.right;
  acc.top = acc.top < y ? y : acc.top;
  acc.bottom = acc.bottom > y ? y : acc.bottom;
  return acc;
}, {
  top: Number.MIN_VALUE,
  bottom: Number.MAX_VALUE,
  left: Number.MAX_VALUE,
  right: Number.MIN_VALUE,
});

const scaleRect = (rect, scale) => {
  const xCenter = (rect.right + rect.left) / 2;
  const yCenter = (rect.top + rect.bottom) / 2;
  return {
    top: (rect.top - yCenter) * scale + yCenter,
    bottom: (rect.bottom - yCenter) * scale + yCenter,
    left: (rect.left - xCenter) * scale + xCenter,
    right: (rect.right - xCenter) * scale + xCenter,
  };
};

export {
  getPointMassCenter,
  getPerimeterMassCenter,
  getSolidMassCenter,
  polygon2polyline,
  euDist,
  getMultiPolygonSolidMassCenter,
  getBoundingRect,
  scaleRect
};
