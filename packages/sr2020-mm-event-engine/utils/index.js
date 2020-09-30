import * as R from 'ramda';
import 'sr2020-mm-hacks-n-fixes/leafletWindowMP';
import { LatLngBounds } from 'leaflet/src/geo/LatLngBounds';

export function isGeoLocation(location) {
  return location.layer_id === 1 && !R.isEmpty(location.polygon);
}

const notEquals = R.pipe(R.equals, R.not);

export function getArrDiff(arr, prevArr, getKey, hasDifference = notEquals) {
  const arrIndex = R.indexBy(getKey, arr);
  const prevArrIndex = R.indexBy(getKey, prevArr);
  const arrKeys = R.keys(arrIndex);
  if (arrKeys.length !== arr.length) {
    console.error('arr keys are not unique');
  }
  const prevArrKeys = R.keys(prevArrIndex);
  if (prevArrKeys.length !== prevArr.length) {
    console.error('prevArr keys are not unique');
  }
  return R.union(arrKeys, prevArrKeys).reduce((acc, key) => {
    if (!!arrIndex[key] && !!prevArrIndex[key]) {
      if (hasDifference(arrIndex[key], prevArrIndex[key])) {
        acc.updated.push({
          item: arrIndex[key],
          prevItem: prevArrIndex[key],
        });
      } else {
        acc.unchanged.push(prevArrIndex[key]);
      }
    } else if (arrIndex[key]) {
      acc.added.push(arrIndex[key]);
    } else { // !!prevArrIndex[key]
      acc.removed.push(prevArrIndex[key]);
    }

    return acc;
  }, {
    added: [],
    updated: [],
    removed: [],
    unchanged: [],
  });
}

export function latLngsToBounds(latLngs) {
  const bounds = new LatLngBounds();
  latLngs.forEach(bounds.extend.bind(bounds));
  return bounds;
}

// based on Leaflet implementation
// https://github.com/Leaflet/Leaflet/blob/37d2fd15ad6518c254fae3e033177e96c48b5012/src/layer/vector/Polygon.js#L76
export function getPolygonCentroid(polygon) {
  const pairs = R.aperture(2, [...polygon[0], polygon[0][0]]);
  const data = pairs.reduce((acc, [p1, p2]) => {
    const f = p1.lat * p2.lng - p2.lat * p1.lng;
    acc.lat += (p1.lat + p2.lat) * f;
    acc.lng += (p1.lng + p2.lng) * f;
    acc.area += f * 3;
    return acc;
  }, {
    lat: 0,
    lng: 0,
    area: 0,
  });
  if (data.area === 0) {
    // Polygon is so small that all points are on same pixel.
    return pairs[0];
  }
  return {
    lat: data.lat / data.area,
    lng: data.lng / data.area,
  };
}

export const isClinicallyDead = (charState) => charState.healthState === 'clinically_dead';

// random integer from min (including min) to max (including max)
export function randomInteger(min, max) {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}
