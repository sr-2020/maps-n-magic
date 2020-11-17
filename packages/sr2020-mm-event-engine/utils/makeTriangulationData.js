import * as R from 'ramda';
import { Delaunay } from 'd3-delaunay';

import {
  getArrDiff, isGeoLocation, getPolygonCentroid, deg2meters,
  latLngsToBounds, getPolygonMinDistance, pairToEdgeId, edgeIdToPair,
} from './index';

import { union, difference } from './set';

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
export function makeTriangulationData(data) {
  const centroids = data.map((loc) => ({
    locationId: loc.id,
    centroidLatLng: getPolygonCentroid(loc.polygon),
  }));
  // const points = centroids.map(({ lat, lng }) => [lat, lng]);
  // const points = centroids.map(deg2meters).map(({ lat, lng }) => [lat, lng]);
  // console.log(points);

  // console.log('lat m', epsilon * 111100, 'lng m', epsilon * 63995);
  // const epsilon = 0.01;

  // const moveLatLng = ({ lat, lng }) => ({ lat: lat + 4.3, lng: lng - 8.45 });

  // const exportData = data.map((loc, i) => {
  //   const polygon = [loc.polygon[0].map(moveLatLng)];
  //   return ({
  //     id: i + 1,
  //     centroid: moveLatLng(getPolygonCentroid(loc.polygon)),
  //     polygon,
  //   });
  // });
  // console.log(JSON.stringify(exportData, null, '  '));

  const precalcData = getPrecalcData(data);

  // first - triangulation
  // const edgeSet = makeConnectionsByTriangulation(data);

  // second - dense clusters + intercluster connections
  // const closestLocationsEdgeSet = connectClosestLocations(precalcData);
  // const neighborsIndex = initNeighborsIndex(data);
  // edgeSetToNeighborsIndex(neighborsIndex, closestLocationsEdgeSet);
  // const clusterList = collectClusters(neighborsIndex);
  // const clustersEdgeSet = connectClosestXClusters(precalcData, clusterList, neighborsIndex);
  // const edgeSet = union(closestLocationsEdgeSet, clustersEdgeSet);

  // third - dist is smaller than median
  // const edgeSet = locMedianBasedApproach(precalcData);

  // fourth - cluster dist is smaller than median
  // const closestLocationsEdgeSet = connectClosestLocations(precalcData);
  // const neighborsIndex = initNeighborsIndex(data);
  // edgeSetToNeighborsIndex(neighborsIndex, closestLocationsEdgeSet);
  // const clusterList = collectClusters(neighborsIndex);
  // const clustersEdgeSet = connectClustersCloserThanMedian(precalcData, clusterList);
  // const edgeSet = union(closestLocationsEdgeSet, clustersEdgeSet);

  // fifth - connect closest cluster
  // const closestLocationsEdgeSet = connectClosestLocations(precalcData);
  // const neighborsIndex = initNeighborsIndex(data);
  // edgeSetToNeighborsIndex(neighborsIndex, closestLocationsEdgeSet);
  // const clusterList = collectClusters(neighborsIndex);
  // const clustersEdgeSet = connectClosestClusters(precalcData, clusterList);
  // const edgeSet = union(closestLocationsEdgeSet, clustersEdgeSet);

  // sixth - ClosestLocations + (triangulation - ClosestLocation clique - long connections)
  const closestLocationsEdgeSet = connectClosestLocations(precalcData);
  const neighborsIndex = initNeighborsIndex(data);
  edgeSetToNeighborsIndex(neighborsIndex, closestLocationsEdgeSet);
  const clusterList = collectClusters(neighborsIndex);
  const clusterCliqueEdgeSet = clustersToClusterCliques(clusterList);
  const triangulationEdgeSet = makeConnectionsByTriangulation(data);
  const edgeDistances = edgeSetToDistList(precalcData, triangulationEdgeSet); // metres
  const longEdges = edgeDistances.reduce((edgeSet, el) => {
    if (el.dist > 150) {
      edgeSet.add(el.edgeId);
    }
    return edgeSet;
  }, new Set());
  const triangulationSubEdgeSet = difference(difference(triangulationEdgeSet, clusterCliqueEdgeSet), longEdges);
  const edgeSet1 = union(triangulationSubEdgeSet, closestLocationsEdgeSet);

  const neighborsIndex2 = initNeighborsIndex(data);
  edgeSetToNeighborsIndex(neighborsIndex2, edgeSet1);
  const clusterList2 = collectClusters(neighborsIndex2);
  const clusterDists2 = getClusterDists(precalcData, clusterList2);
  // console.log(clusterDists2);
  const clustersTreeEdgeSet = connectClustersWithGreedyTree(clusterDists2);
  const edgeSet = union(edgeSet1, clustersTreeEdgeSet);

  const neighborsIndex3 = initNeighborsIndex(data);
  edgeSetToNeighborsIndex(neighborsIndex3, edgeSet);

  // const edgeSet = triangulationSubEdgeSet;

  return {
    neighborsIndex: neighborsIndex3,
    centroids,
    edgeSet,
  };
}

function edgeSetToDistList(precalcData, edgeSet) {
  const locIndex = R.indexBy(R.prop('locationId'), precalcData);
  return Array.from(edgeSet).map((edgeId) => {
    const [locId1, locId2] = edgeIdToPair(edgeId);
    const loc1 = locIndex[locId1];
    const loc2 = locIndex[locId2];

    const dist = getPolygonMinDistance(loc1.polygon[0], loc2.polygon[0]);
    return {
      edgeId,
      dist,
    };
  });
}

function initNeighborsIndex(data) {
  return data.reduce((acc, loc, i) => {
    acc.set(loc.id, []);
    return acc;
  }, new Map());
}

function connectClosestLocations(precalcData) {
  const edgeSet = new Set();
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
            edgeSet.add(pairToEdgeId(loc1.locationId, loc2.locationId));
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
  // console.log({
  //   precalcDataLength: precalcData.length,
  //   totalCases,
  //   simpleTestPassed,
  //   simpleTestFailed,
  //   advancedTestPassed,
  //   advancedTestFailed,
  // });
  return edgeSet;
}

function edgeSetToNeighborsIndex(neighborsIndex, edgeSet) {
  Array.from(edgeSet).forEach((edgeId) => {
    const [locId1Str, locId2Str] = edgeIdToPair(edgeId);
    const locId1 = Number(locId1Str);
    const locId2 = Number(locId2Str);
    let neighborsList1 = neighborsIndex.get(locId1);
    if (neighborsList1 === undefined) {
      neighborsList1 = [];
      neighborsIndex.set(locId1, neighborsList1);
    }
    neighborsList1.push(locId2);
    let neighborsList2 = neighborsIndex.get(locId2);
    if (neighborsList2 === undefined) {
      neighborsList2 = [];
      neighborsIndex.set(locId2, neighborsList2);
    }
    neighborsList2.push(locId1);
  });
  neighborsIndex.forEach((value, key) => {
    neighborsIndex.set(key, R.uniq(value));
  });
  return neighborsIndex;
}

function collectClusters(neighborsIndex) {
  const invClusters = {};

  function setClusterId(locationId, neighborsList, clusterId) {
    if (isInCluster(locationId)) {
      return;
    }
    invClusters[locationId] = clusterId;
    neighborsList.forEach((nextLocId) => setClusterId(nextLocId, neighborsIndex.get(nextLocId), clusterId));
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

function clustersToClusterCliques(clusterList) {
  const edgeSet = new Set();
  clusterList.filter((el) => el.locList.length > 1).forEach((el) => {
    R.xprod(el.locList, el.locList).filter((pair) => pair[0] !== pair[1]).forEach((pair) => edgeSet.add(pairToEdgeId(pair[0], pair[1])));
  });

  return edgeSet;
}

function connectClosestXClusters(precalcData, clusterList, neighborsIndex) {
  const edgeSet = new Set();
  const clusterDists = getClusterDists(precalcData, clusterList);
  clusterDists.forEach((dists) => {
    const dists2 = R.sortBy(R.prop('minDist'), dists);
    R.take(clusterConnectionsNum, dists2).forEach(({ locId1, locId2 }) => {
      edgeSet.add(pairToEdgeId(locId1, locId2));
    });
  });

  // closestPointOnSegment
  // console.log(this.neighborsIndex);
  // console.log(invClusters);
  // console.log(clusterIndex);
  // console.log(clusterList);
  return edgeSet;
}

function connectClustersCloserThanMedian(precalcData, clusterList) {
  const edgeSet = new Set();
  const clusterDists = getClusterDists(precalcData, clusterList);
  const distArr = R.flatten(clusterDists);
  const median = R.pipe(
    R.pluck('minDist'),
    R.median,
  )(distArr);
  const divider = 1.25;
  distArr.filter((el) => el.minDist < median / divider).forEach(({ locId1, locId2 }) => {
    edgeSet.add(pairToEdgeId(locId1, locId2));
  });
  return edgeSet;
}

function connectClosestClusters(precalcData, clusterList) {
  const edgeSet = new Set();
  const clusterDists = getClusterDists(precalcData, clusterList);
  const distArr = R.sortBy(R.prop('minDist'), R.flatten(clusterDists));
  const clusterSet = new Map();
  clusterList.forEach((cluster) => clusterSet.set(cluster.clusterId, {}));

  distArr.forEach((el) => {
    const {
      locId1, locId2, clusterId1, clusterId2,
    } = el;
    const set1 = clusterSet.get(clusterId1);
    const set2 = clusterSet.get(clusterId2);
    if (!set1[String(clusterId2)] || !set2[String(clusterId1)]) {
      const join = {
        ...set1, ...set2, [clusterId1]: true, [clusterId2]: true,
      };
      R.keys(join).forEach((key) => clusterSet.set((key), join));
      edgeSet.add(pairToEdgeId(locId1, locId2));
      // clusterSet.add(clusterId1);
      // clusterSet.add(clusterId2);
    }
  });
  return edgeSet;
}

function getClusterDists(precalcData, clusterList) {
  const locIndex = R.indexBy(R.prop('locationId'), precalcData);
  return clusterList.map((cluster1, i) => {
    const dists = clusterList.filter((cluster2, j) => i !== j).map((cluster2, j) => {
      const distArr = getDistArr(locIndex, cluster1.locList, cluster2.locList).map((el) => ({
        ...el,
        clusterId1: cluster1.clusterId,
        clusterId2: cluster2.clusterId,
      }));
      const minObj = R.reduce(R.minBy(R.prop('minDist')), { minDist: Infinity }, distArr);
      return minObj;
    });
    return dists;
  });
}

function locMedianBasedApproach(precalcData) {
  const edgeSet = new Set();
  const locIndex = R.indexBy(R.prop('locationId'), precalcData);
  const distArr = getDistArr(locIndex, R.keys(locIndex), R.keys(locIndex));
  const median = R.pipe(
    R.pluck('minDist'),
    R.median,
  )(distArr);
  const divider = 3;
  distArr.filter((el) => el.minDist < median / divider).forEach(({ locId1, locId2 }) => {
    edgeSet.add(pairToEdgeId(locId1, locId2));
  });
  return edgeSet;
}

function addConnection(neighborsIndex, locId1, locId2) {
  const obj1 = neighborsIndex.get(locId1);
  const list1 = R.uniq([...obj1.neighborsList, locId2]);
  obj1.neighborsList = list1;
  const obj2 = neighborsIndex.get(locId2);
  const list2 = R.uniq([...obj2.neighborsList, locId1]);
  obj2.neighborsList = list2;
}

function getDistArr(locIndex, locList1, locList2) {
  const distArr = R.xprod(locList1, locList2).filter(([locId1, locId2]) => locId1 !== locId2).map(([locId1, locId2]) => {
    const loc1 = locIndex[locId1];
    const loc2 = locIndex[locId2];

    const min = getPolygonMinDistance(loc1.polygon[0], loc2.polygon[0]);
    return {
      minDist: min,
      locId1,
      locId2,
    };
  });
  return distArr;
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

export function makeConnectionsByTriangulation(data) {
  const edgeSet = new Set();
  const centroids = data.map((loc) => (loc.centroid = getPolygonCentroid(loc.polygon)));
  const points = centroids.map(deg2meters).map(({ lat, lng }) => [lat, lng]);
  const delaunay = Delaunay.from(points);

  data.forEach((loc, i) => {
    const neighborsList = [...delaunay.neighbors(i)];
    neighborsList.forEach((index) => edgeSet.add(pairToEdgeId(loc.id, data[index].id)));
  });
  return edgeSet;
}

function connectClustersWithGreedyTree(clusterDists) {
  const edgeSet = new Set();
  const arr = R.pipe(
    R.flatten,
    R.filter(({ locId1, locId2 }) => locId1 < locId2),
    R.sortBy(R.prop('minDist')),
  )(clusterDists);

  // (clusterDists).filter();
  let clusterIndex = {};
  arr.forEach((el) => {
    clusterIndex[el.clusterId1] = el.clusterId1;
    clusterIndex[el.clusterId2] = el.clusterId2;
  });
  // console.log('arr', arr);
  // console.log('clusterIndex', clusterIndex);
  const selectedDists = [];

  arr.forEach(((el) => {
  // const el = arr2[0];
    const { clusterId1, clusterId2 } = el;
    const subclusterId1 = clusterIndex[clusterId1];
    const subclusterId2 = clusterIndex[clusterId2];
    if (subclusterId1 !== subclusterId2) {
      selectedDists.push(el);
      clusterIndex = R.mapObjIndexed((value) => (value === subclusterId2 ? subclusterId1 : value), clusterIndex);
      // console.log('-------');
      // console.log(selectedDists, clusterIndex);
    }
  }));

  selectedDists.forEach((el) => edgeSet.add(pairToEdgeId(el.locId1, el.locId2)));
  // console.log('connectClustersWithGreedyTree', edgeSet);
  return edgeSet;
}
