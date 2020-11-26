import * as R from 'ramda';
import 'sr2020-mm-hacks-n-fixes/leafletWindowMP';
import { LatLngBounds } from 'leaflet/src/geo/LatLngBounds';
import { pointToSegmentDistance } from 'leaflet/src/geometry/LineUtil';
import 'sr2020-mm-hacks-n-fixes/leafletUnwindowMP';
import * as gi from '@thi.ng/geom-isec';
import * as gcp from '@thi.ng/geom-closest-point';
import clippingUtils from 'polygon-clipping';
import { bodyConditionsSet } from 'sr2020-mm-data/gameConstants';

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

export const isClinicallyDead = (charState) => charState.healthState === bodyConditionsSet.clinically_dead;

// export const isRelevant = (curTime) => (el) => ((curTime - el.timestamp) < (30 * 60000));
export const isRelevant = (curTime) => (el) =>
  // console.log(curTime, el.timestamp, curTime - el.timestamp);
  ((curTime - el.timestamp) < (30 * 60000))
;

// random integer from min (including min) to max (including max)
export function randomInteger(min, max) {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

export function sample(arr) {
  if (arr.length === 0) {
    return null;
  }
  return arr[Math.floor(Math.random() * arr.length)];
}

// 111100 meters in lat
// 63995 meters in lng

export const deg2meters = ({ lat, lng }) => ({ lat: lat * 111100, lng: lng * 63995 });
export const meters2deg = ({ lat, lng }) => ({ lat: lat / 111100, lng: lng / 63995 });

const latlngs2arr = R.map((el) => [el.lat, el.lng]);

export function isPointInLocation(latlng, latlngPolygon) {
  // const latlngPolygon = loc.getLatLngs();
  // const bounds = loc.getBounds();
  const bounds = latLngsToBounds(latlngPolygon);

  const simpleTest = bounds.contains(latlng);
  if (simpleTest) {
    const coords = [latlng.lat, latlng.lng];
    const polygon = latlngs2arr(latlngPolygon);
    return gi.pointInPolygon2(coords, polygon);
  }
  return false;
}

export function getPolygonMinDistance1(polygon1, polygon2) {
  // getPolygonMinDistance2(polygon1, polygon2);
  const latLng2Point = ({ lat, lng }) => ({ x: lat, y: lng });
  polygon1 = polygon1.map(latLng2Point);
  polygon2 = polygon2.map(latLng2Point);
  // console.log(polygon1, polygon2);
  const pairs1 = R.aperture(2, [...polygon1, polygon1[0]]);
  const pairs2 = R.aperture(2, [...polygon2, polygon2[0]]);

  const distance = [
    ...R.xprod(polygon1, pairs2).map(([pt, pair]) => pointToSegmentDistance(pt, pair[0], pair[1])),
    ...R.xprod(polygon2, pairs1).map(([pt, pair]) => pointToSegmentDistance(pt, pair[0], pair[1])),
  ];
  // console.log('distLeaflet', distance);

  return R.reduce(R.min, Infinity, distance);
}

export function getPolygonMinDistance(polygon1, polygon2) {
  const latLng2Point = ({ lat, lng }) => ([lat, lng]);
  polygon1 = polygon1.map(latLng2Point);
  polygon2 = polygon2.map(latLng2Point);
  const intersection = clippingUtils.intersection([polygon1], [polygon2]);
  // console.log('intersection', intersection);
  if (intersection.length > 0) {
    return 0;
  }

  // console.log(polygon1, polygon2);
  const pairs1 = R.aperture(2, [...polygon1, polygon1[0]]);
  const pairs2 = R.aperture(2, [...polygon2, polygon2[0]]);

  const distance = [
    ...R.xprod(polygon1, pairs2).map(([pt, pair]) => gcp.distToSegment(pt, pair[0], pair[1])),
    ...R.xprod(polygon2, pairs1).map(([pt, pair]) => gcp.distToSegment(pt, pair[0], pair[1])),
  ];
  // console.log('distThing', distance);

  return R.reduce(R.min, Infinity, distance);
}

export function pairToEdgeId(locId1, locId2) {
  return Number(locId1) < Number(locId2) ? `${locId1}_${locId2}` : `${locId2}_${locId1}`;
}

export function edgeIdToPair(edgeId) {
  return edgeId.split('_');
}

// from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export function shuffle(array) {
  array = [...array];
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export function getUserNameStr(user) {
  return user.name !== '' ? ` (${user.name})` : '';
}
