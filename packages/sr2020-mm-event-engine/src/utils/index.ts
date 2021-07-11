import * as R from 'ramda';
import 'sr2020-mm-hacks-n-fixes/leafletWindowMP';
// import { LatLngBounds } from 'leaflet/src/geo/LatLngBounds';
import L from 'leaflet';
import 'sr2020-mm-hacks-n-fixes/leafletUnwindowMP';
import * as gi from '@thi.ng/geom-isec';
import * as gcp from '@thi.ng/geom-closest-point';
import clippingUtils from 'polygon-clipping';
import AbortController from 'abort-controller';
import fetch from 'isomorphic-fetch';

import { 
  LocationRecord, 
  SRLatLng, 
  SRPolygon, 
  EdgeId,
  RawCharacterHealthState,
  BodyConditions,
  SpiritRoute,
  Spirit
} from "../types";

export function isGeoLocation(location: LocationRecord): boolean {
  return location.layer_id === 1 && !R.isEmpty(location.polygon);
}

export const isNotEmptyPolygon: (location: LocationRecord) => boolean = R.pipe(
  R.prop('polygon'),
  R.equals({}),
  R.not,
);

const notEquals = R.pipe(R.equals, R.not);

export interface ArrDiffUpdate<T> {
  item: T,
  prevItem: T
};

export interface ArrDiff<T>{
  added: T[];
  updated: ArrDiffUpdate<T>[];
  removed: T[];
  unchanged: T[];
}

export function getArrDiff<T>(
  arr: T[], 
  prevArr: T[], 
  getKey: (el: T) => string | number, 
  hasDifference: (el1: T, el2: T) => boolean = notEquals
): ArrDiff<T> {
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
  const diff = R.union(arrKeys, prevArrKeys).reduce((acc, key) => {
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
  } as ArrDiff<T>);
  return diff;
}

export function latLngsToBounds(latLngs: L.LatLngLiteral[]): L.LatLngBounds {
  // if(latLngs.length === 0) {
  //   return null;
  // }
  const bounds = new L.LatLngBounds(latLngs[0], latLngs[0]);
  latLngs.forEach(bounds.extend.bind(bounds));
  return bounds;
}

// based on Leaflet implementation
// https://github.com/Leaflet/Leaflet/blob/37d2fd15ad6518c254fae3e033177e96c48b5012/src/layer/vector/Polygon.js#L76
export function getPolygonCentroid(polygon: SRPolygon): SRLatLng {
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
    return pairs[0][0];
  }
  return {
    lat: data.lat / data.area,
    lng: data.lng / data.area,
  };
}

export const isClinicallyDead = (charState: RawCharacterHealthState): boolean => 
  charState.healthState === BodyConditions.Clinically_dead;

export const isBiologicallyDead = (charState: RawCharacterHealthState): boolean => 
  charState.healthState === BodyConditions.Biologically_dead;

export const isDead = (charState: RawCharacterHealthState): boolean => 
  isClinicallyDead(charState) || isBiologicallyDead(charState);

export const healthStateShortNames: Record<string, string> = {
  'healthy': 'ЗД',
  'wounded': 'ТЯЖ',
  'clinically_dead': 'КС',
  'biologically_dead': 'АС',
};


// Check if it is necessary to show clinically dead character.
// By rules if character is dead more then 30 minutes it is not necessary to show character.
// export const isRelevant = (curTime) => (el) => ((curTime - el.timestamp) < (30 * 60000));
export const isRelevant = (curTime: number) => (el: RawCharacterHealthState): boolean =>
  // console.log(curTime, el.timestamp, curTime - el.timestamp);
  ((curTime - el.timestamp) < (30 * 60000))
;

// random integer from min (including min) to max (including max)
export function randomInteger(min: number, max: number): number {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

export function sample(arr: readonly []): null;
export function sample<T>(arr: readonly T[]): T;
export function sample<T>(arr: readonly T[]): T | null {
  if (arr.length === 0) {
    return null;
  }
  return arr[Math.floor(Math.random() * arr.length)];
}

// 111100 meters in lat
// 63995 meters in lng

export const deg2meters = ({ lat, lng }: SRLatLng):SRLatLng => ({ lat: lat * 111100, lng: lng * 63995 });
export const meters2deg = ({ lat, lng }: SRLatLng):SRLatLng => ({ lat: lat / 111100, lng: lng / 63995 });

// @ts-ignore
const latlngs2arr = R.map((el) => [el.lat, el.lng]);

export function isPointInLocation(latlng: SRLatLng, latlngPolygon: SRLatLng[]): boolean {
  // const latlngPolygon = loc.getLatLngs();
  // const bounds = loc.getBounds();
  const bounds = latLngsToBounds(latlngPolygon);

  const simpleTest = bounds.contains(latlng);
  if (simpleTest) {
    const coords = [latlng.lat, latlng.lng];
    const polygon = latlngs2arr(latlngPolygon);
    return !!gi.pointInPolygon2(coords, polygon);
  }
  return false;
}

// export function getPolygonMinDistance1(polygon1, polygon2) {
//   // getPolygonMinDistance2(polygon1, polygon2);
//   const latLng2Point = ({ lat, lng }) => ({ x: lat, y: lng });
//   polygon1 = polygon1.map(latLng2Point);
//   polygon2 = polygon2.map(latLng2Point);
//   // console.log(polygon1, polygon2);
//   const pairs1 = R.aperture(2, [...polygon1, polygon1[0]]);
//   const pairs2 = R.aperture(2, [...polygon2, polygon2[0]]);

//   const distance = [
//     ...R.xprod(polygon1, pairs2).map(([pt, pair]) => pointToSegmentDistance(pt, pair[0], pair[1])),
//     ...R.xprod(polygon2, pairs1).map(([pt, pair]) => pointToSegmentDistance(pt, pair[0], pair[1])),
//   ];
//   // console.log('distLeaflet', distance);

//   return R.reduce(R.min, Infinity, distance);
// }

const latLng2Point = ({ lat, lng }: SRLatLng): [lat: number, lng: number] => ([lat, lng]);

export function getPolygonMinDistance(rawPolygon1: SRLatLng[], rawPolygon2: SRLatLng[]): number {
  const polygon1 = rawPolygon1.map(latLng2Point);
  const polygon2 = rawPolygon2.map(latLng2Point);
  const intersection = clippingUtils.intersection([polygon1], [polygon2]);
  // console.log('intersection', intersection);
  if (intersection.length > 0) {
    return 0;
  }

  // console.log(polygon1, polygon2);
  const pairs1 = R.aperture(2, [...polygon1, polygon1[0]]);
  const pairs2 = R.aperture(2, [...polygon2, polygon2[0]]);

  const distance = [
    // @ts-ignore
    ...R.xprod(polygon1, pairs2).map(([pt, pair]) => gcp.distToSegment(pt, pair[0], pair[1])),
    // @ts-ignore
    ...R.xprod(polygon2, pairs1).map(([pt, pair]) => gcp.distToSegment(pt, pair[0], pair[1])),
  ];
  // console.log('distThing', distance);

  // hardcoded type check
  return R.reduce(R.min, Infinity, distance) as number;
}

export function pairToEdgeId(locId1: number, locId2: number): EdgeId {
  return Number(locId1) < Number(locId2) ? `${locId1}_${locId2}` : `${locId2}_${locId1}`;
}

export function edgeIdToPair(edgeId: EdgeId): [locId1: string, locId2: string] {
  // This conversion should work by edge id design
  // @ts-ignore
  return edgeId.split('_');
}

// from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export function shuffle<T>(array: T[]): T[] {
  array = [...array];
  let currentIndex = array.length;
  let temporaryValue: T;
  let randomIndex: number;

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

export function getUserNameStr(user: {name: string}): string {
  return user.name !== '' ? ` (${user.name})` : '';
}

export async function fetchWithTimeout(resource: RequestInfo, options: RequestInit & {timeout?: number}) {
  const { timeout = 8000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);

  return response;
}

export function getTimeOnRoute(route: SpiritRoute, speedPercent: number): {
  timeOnWaypoint: number;
  timeOnRoute: number;
} {
  const timeOnWaypoint = route.waitTimeMinutes / (speedPercent / 100);
  return {
    timeOnWaypoint,
    timeOnRoute: route.waypoints.length * timeOnWaypoint
  };
}

export function getSpiritLocationId(spirit: Spirit): number | undefined {
  const { state } = spirit; 
  if (state.status === 'OnRoute') {
    return state.route.waypoints[state.waypointIndex];
  }
  return undefined;
}

export function assert(condition: any, msg?: string): asserts condition {
  if (!condition) {
    throw new Error(msg);
  }
}