//http://e-maxx.ru/algo/gravity_center
import * as R from "ramda";

// by points
function getPointMassCenter(polygon) {
  const sums = polygon.reduce( (acc, point) => {
    acc[0] += point[0];
    acc[1] += point[1];
    return acc;
  }, [0,0]);
  return {
    x: sums[0]/polygon.length,
    y: sums[1]/polygon.length,
  }
}
const dist = (arr1, arr2) => Math.sqrt((arr1[0]-arr2[0])*(arr1[0]-arr2[0]) + (arr1[1]-arr2[1])*(arr1[1]-arr2[1]));
// by edges
function getPerimeterMassCenter(polygon) {
  const polygon2 = polygon.map((pair, i) => {
    if(i < polygon.length-1) {
      return [(pair[0] + polygon[i+1][0]) / 2, (pair[1] + polygon[i+1][1]) / 2, dist(pair, polygon[i+1])];
    } else {
      return [(pair[0] + polygon[0][0]) / 2, (pair[1] + polygon[0][1]) / 2, dist(pair, polygon[0])];
    }
  });
  const sums = polygon2.reduce( (acc, point) => {
    acc[0] += point[0]*point[2];
    acc[1] += point[1]*point[2];
    return acc;
  }, [0,0]);
  const perimeter = R.sum(polygon2.map(p => p[2]));
  return {
    x: sums[0]/perimeter,
    y: sums[1]/perimeter,
  }
}

function getTriangleArea(triangle) {
    const a = dist(triangle[0],triangle[1]);
    const b = dist(triangle[0],triangle[2]);
    const c = dist(triangle[1],triangle[2]);
    const p = (a+b+c)/2;
    const S = Math.sqrt(p*(p-a)*(p-b)*(p-c));
    return S;
}

// result is the same as for getPointMassCenter
function getTriangleCentroid(triangle) {
    const pt1 = triangle[0];
    const pt2 = [(triangle[1][0] + triangle[2][0])/2,(triangle[1][1] + triangle[2][1])/2 ];

    return {
        x: (pt2[0]-pt1[0])*2/3 + pt1[0], 
        y: (pt2[1]-pt1[1])*2/3 + pt1[1],
        pt1,
        pt2
    };
}

function getSolidMassCenter(polygon) {
    const pt1 = polygon[0];
    const triangles = R.aperture(2, R.tail(polygon)).map(R.concat([pt1]));
    console.log(polygon);
    console.log(triangles);
    const intermediate = triangles.map((triangle, i) => {
        // triangle = [[3,0],[0,0],[0,5]];
        return {
            ...getPointMassCenter(triangle),
            volume: getTriangleArea(triangle)
        }
    });
    console.log(intermediate);

    const area = R.sum(intermediate.map(R.prop('volume')));
    const sums = intermediate.reduce( (acc, point) => {
        acc[0] += point.x*point.volume;
        acc[1] += point.y*point.volume;
        return acc;
    }, [0,0]);
    return {
        x: sums[0]/area,
        y: sums[1]/area,
    }
}

export {getPointMassCenter, getPerimeterMassCenter, getSolidMassCenter};