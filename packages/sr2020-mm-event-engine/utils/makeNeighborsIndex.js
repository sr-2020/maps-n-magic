import * as R from 'ramda';
import { Delaunay } from 'd3-delaunay';

import {
  getArrDiff, isGeoLocation, getPolygonCentroid, deg2meters, latLngsToBounds, getPolygonMinDistance,
} from './index';

// const epsilon = 1;
// const epsilon = 0;
// const epsilon = 0.00001;
// const epsilon = 0.00003;
// const epsilon = 0.00005;
// const epsilon = 0.0001;
// const metersEpsilon = 5;
const metersEpsilon = 10;
// const metersEpsilon = 20;
// const metersEpsilon = 60;

const clusterConnectionsNum = 3;

// 111100 meters in lat
// 63995 meters in lng

function getPrecalcData(data) {
  return data.map((loc) => {
    // const loc = data[0];
    const metersPolygon = [loc.polygon[0].map(deg2meters)];
    // const bounds = latLngsToBounds(loc.polygon[0]);
    const bounds = latLngsToBounds(metersPolygon[0]);
    // console.log('before', bounds.toBBoxString());
    // extendBoundsWithE(bounds, epsilon);
    extendBoundsWithE(bounds, metersEpsilon);
    // console.log('after', bounds.toBBoxString());

    return {
      locationId: loc.id,
      // polygon: loc.polygon,
      polygon: metersPolygon,
      bounds,
    };
  });
}

// eslint-disable-next-line max-lines-per-function
export function makeNeighborsIndex(data) {
  const centroids = data.map((loc) => (loc.centroid = getPolygonCentroid(loc.polygon)));
  // const points = centroids.map(({ lat, lng }) => [lat, lng]);
  // const points = centroids.map(deg2meters).map(({ lat, lng }) => [lat, lng]);
  // console.log(points);

  // console.log('lat m', epsilon * 111100, 'lng m', epsilon * 63995);
  // const epsilon = 0.01;

  const precalcData = getPrecalcData(data);

  const neighborsIndex = data.reduce((acc, loc, i) => {
    acc.set(loc.id, {
      centroid: centroids[i],
      neighborsList: [],
    });
    return acc;
  }, new Map());

  connectClosestLocations(precalcData, neighborsIndex);
  const clusterList = collectClusters(neighborsIndex);
  connectClusters(precalcData, clusterList, neighborsIndex);

  return neighborsIndex;
}

function connectClosestLocations(precalcData, neighborsIndex) {
  let totalCases = 0;
  let simpleTestPassed = 0;
  let simpleTestFailed = 0;
  let advancedTestPassed = 0;
  let advancedTestFailed = 0;
  precalcData.forEach((loc1) => {
    precalcData.forEach((loc2) => {
      // const necessaryLocs = loc1.locationId === 3132 && loc2.locationId === 3166;
      // if (!necessaryLocs) {
      //   return;
      // }

      if (loc1.locationId < loc2.locationId) {
        totalCases++;
        if (loc1.bounds.intersects(loc2.bounds)) {
          simpleTestPassed++;
          const min = getPolygonMinDistance(loc1.polygon[0], loc2.polygon[0]);
          // if (min < epsilon) {
          if (min < metersEpsilon) {
            advancedTestPassed++;
            neighborsIndex.get(loc1.locationId).neighborsList.push(loc2.locationId);
            neighborsIndex.get(loc2.locationId).neighborsList.push(loc1.locationId);
          } else {
            advancedTestFailed++;
          }
          // console.log('min', min);
        } else {
          simpleTestFailed++;
        }
      }
    });
  });
  console.log({
    precalcDataLength: precalcData.length,
    totalCases,
    simpleTestPassed,
    simpleTestFailed,
    advancedTestPassed,
    advancedTestFailed,
  });
}

function collectClusters(neighborsIndex) {
  const invClusters = {};

  function setClusterId(locationId, locData, clusterId) {
    if (isInCluster(locationId)) {
      return;
    }
    invClusters[locationId] = clusterId;
    locData.neighborsList.forEach((nextLocId) => setClusterId(nextLocId, neighborsIndex.get(nextLocId), clusterId));
  }

  function isInCluster(locationId) {
    return invClusters[locationId] !== undefined;
  }

  let clusterIdCounter = 0;
  function getNextClusterId() {
    clusterIdCounter++;
    return String(clusterIdCounter);
  }

  [...neighborsIndex.keys()].forEach((locationId) => {
    if (!isInCluster(locationId)) {
      const clusterId = getNextClusterId();
      setClusterId(locationId, neighborsIndex.get(locationId), clusterId);
    }
  });

  const clusterIndex = R.pipe(
    R.invert,
    R.mapObjIndexed((val) => val.map(Number)),
  )(invClusters);
  const clusterList = R.toPairs(clusterIndex).map(([clusterId, locList]) => ({
    clusterId,
    locList,
  }));
  return clusterList;
}

function connectClusters(precalcData, clusterList, neighborsIndex) {
  const locIndex = R.indexBy(R.prop('locationId'), precalcData);
  clusterList.forEach((cluster1, i) => {
    const dists = clusterList.filter((cluster2, j) => i !== j).map((cluster2, j) => {
      const distArr = R.xprod(cluster1.locList, cluster2.locList).map(([locId1, locId2]) => {
        // const locId1 = cluster1.locList[0];
        const loc1 = locIndex[locId1];
        // const locId2 = cluster2.locList[0];
        const loc2 = locIndex[locId2];

        const min = getPolygonMinDistance(loc1.polygon[0], loc2.polygon[0]);
        return {
          clusterId: cluster2.clusterId,
          minDist: min,
          locId1,
          locId2,
        };
      });

      const minObj = R.reduce(R.minBy(R.prop('minDist')), { minDist: Infinity }, distArr);
      return minObj;

      // R.reduce(R.minBy(square), Infinity, []);
    });
    const dists2 = R.sortBy(R.prop('minDist'), dists);
    R.take(clusterConnectionsNum, dists2).forEach(({ locId1, locId2 }) => {
      const obj1 = neighborsIndex.get(locId1);
      const list1 = R.uniq([...obj1.neighborsList, locId2]);
      obj1.neighborsList = list1;
      const obj2 = neighborsIndex.get(locId2);
      const list2 = R.uniq([...obj2.neighborsList, locId1]);
      obj2.neighborsList = list2;
    });
    console.log(dists2);
  });
  // clusterList.forEach((loc2) => {

  // closestPointOnSegment
  // console.log(this.neighborsIndex);
  // console.log(invClusters);
  // console.log(clusterIndex);
  console.log(clusterList);
}

// широта, latitude
// 55
// 54

// долгота, longitude
// 36 37
function extendBoundsWithE(bounds, epsilon) {
  const northWest = bounds.getNorthWest();
  const southEast = bounds.getSouthEast();
  bounds.extend({
    lat: northWest.lat + epsilon,
    lng: northWest.lng - epsilon,
  });
  bounds.extend({
    lat: southEast.lat - epsilon,
    lng: southEast.lng + epsilon,
  });
  return bounds;
}

// Connections by triangulation
// const delaunay = Delaunay.from(points);
// this.neighborsIndex = data.reduce((acc, loc, i) => {
//   const neighborsList = [...delaunay.neighbors(i)];
//   // console.log(loc.id, neighborsIndex);
//   // acc.set(loc.id, neighborsList.map((index) => data[index].id));
//   acc.set(loc.id, {
//     centroid: centroids[i],
//     neighborsList: neighborsList.map((index) => data[index].id),
//   });
//   return acc;
// }, new Map());
