import * as R from 'ramda';
import { Delaunay } from 'd3-delaunay';

import {
  getArrDiff, isGeoLocation, getPolygonCentroid, deg2meters, latLngsToBounds, getPolygonMinDistance,
} from '../utils';
import { AbstractService } from '../core/AbstractService';

// duplicated in LocationHolder
const defaultStyleOptions = {
  color: '#3388ff',
  weight: 3,
  fillOpacity: 0.2,
};

const extractPolygonData = (list) => list.filter(isGeoLocation).map(R.pick(['id', 'polygon']));

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

export class LocationRecordService extends AbstractService {
  metadata = {
    actions: [
      'postLocationRecord',
      'deleteLocationRecord',
      'putLocationRecord',
      'putLocationRecords',
      'postLocationRecordConfirmed',
      'deleteLocationRecordConfirmed',
      'putLocationRecordConfirmed',
      'putLocationRecordsConfirmed',
      'setLocationRecords',
    ],
    requests: ['locationRecord', 'locationRecords', 'triangulationData'],
    emitEvents: [
      'postLocationRecord',
      'deleteLocationRecord',
      'putLocationRecord',
      'putLocationRecords',
      'postLocationRecordRequested',
      'deleteLocationRecordRequested',
      'putLocationRecordRequested',
      'putLocationRecordsRequested',
      'locationRecordsChanged',
      'locationRecordsChanged2',
    ],
    listenEvents: [],
  };

  constructor() {
    super();
    this.locationRecords = [];
    this.neighborsIndex = null;
  }

  setData({ locationRecords } = {}) {
    locationRecords = locationRecords || [];
    this.updateTriangulation(locationRecords, this.locationRecords);
    this.locationRecords = locationRecords;
    this.locationRecords.forEach((loc) => {
      loc.options = {
        ...defaultStyleOptions,
        ...loc.options,
      };
    });
  }

  getData() {
    return {
      locationRecords: this.getLocationRecords(),
    };
  }

  getLocationRecords() {
    return [...this.locationRecords];
  }

  getLocationRecord({ id }) {
    const locationRecord = this.locationRecords.find((br) => br.id === id);
    if (locationRecord === undefined) {
      console.error('location record not found, locationId', id);
    }
    return R.clone(locationRecord);
  }

  setLocationRecords({ locationRecords }) {
    this.setData({ locationRecords });
    this.emit('locationRecordsChanged', {
      locationRecords,
    });
    this.emit('locationRecordsChanged2', {
      type: 'locationRecordsChanged2',
      locationRecords,
    });
  }

  innerSetLocationRecords(locationRecords) {
    this.updateTriangulation(locationRecords, this.locationRecords);
    this.locationRecords = locationRecords;
    this.emit('locationRecordsChanged2', {
      type: 'locationRecordsChanged2',
      locationRecords,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  updateTriangulation(locationRecords, prevLocations) {
    const prevData = extractPolygonData(prevLocations);
    const nextData = extractPolygonData(locationRecords);
    const { unchanged } = getArrDiff(nextData, prevData, R.prop('id'));
    if (!this.neighborsIndex) {
      this.calcTriangulation(nextData);
      return;
    }
    if (prevData.length === unchanged.length
      && prevData.length === nextData.length
    ) {
      console.log('no location changes');
    } else {
      console.log('detected location changes');
      this.calcTriangulation(nextData);
    }
  }

  getTriangulationData() {
    return this.neighborsIndex;
  }

  // eslint-disable-next-line class-methods-use-this
  // eslint-disable-next-line max-lines-per-function
  calcTriangulation(data) {
    const centroids = data.map((loc) => (loc.centroid = getPolygonCentroid(loc.polygon)));
    // const points = centroids.map(({ lat, lng }) => [lat, lng]);
    const points = centroids.map(deg2meters).map(({ lat, lng }) => [lat, lng]);
    // console.log(points);

    const delaunay = Delaunay.from(points);
    this.neighborsIndex = data.reduce((acc, loc, i) => {
      const neighborsList = [...delaunay.neighbors(i)];
      // console.log(loc.id, neighborsIndex);
      // acc.set(loc.id, neighborsList.map((index) => data[index].id));
      acc.set(loc.id, {
        centroid: centroids[i],
        neighborsList: neighborsList.map((index) => data[index].id),
      });
      return acc;
    }, new Map());

    // const epsilon = 1;
    // const epsilon = 0;
    // const epsilon = 0.00001;
    // const epsilon = 0.00003;
    // const epsilon = 0.00005;
    const epsilon = 0.0001;

    // 111100 meters in lat
    // 63995 meters in lng
    console.log('lat m', epsilon * 111100, 'lng m', epsilon * 63995);
    // const epsilon = 0.01;

    const precalcData = data.map((loc) => {
      // const loc = data[0];
      const bounds = latLngsToBounds(loc.polygon[0]);
      // console.log('before', bounds.toBBoxString());
      extendBoundsWithE(bounds, epsilon);
      // console.log('after', bounds.toBBoxString());

      return {
        locationId: loc.id,
        polygon: loc.polygon,
        bounds,
      };
    });

    const neighborsIndex = data.reduce((acc, loc, i) => {
      // const neighborsList = [...delaunay.neighbors(i)];
      // console.log(loc.id, neighborsIndex);
      // acc.set(loc.id, neighborsList.map((index) => data[index].id));
      acc.set(loc.id, {
        centroid: centroids[i],
        // neighborsList: neighborsList.map((index) => data[index].id),
        neighborsList: [],
      });
      return acc;
    }, new Map());

    this.neighborsIndex = neighborsIndex;

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
            if (min < epsilon) {
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

    // closestPointOnSegment
    // console.log(this.neighborsIndex);
  }

  putLocationRecord(action) {
    this.emit('putLocationRecordRequested', action);
  }

  putLocationRecords(action) {
    this.emit('putLocationRecordsRequested', action);
  }

  postLocationRecord = (action) => {
    this.emit('postLocationRecordRequested', action);
  }

  deleteLocationRecord = (action) => {
    this.emit('deleteLocationRecordRequested', action);
  }

  putLocationRecordConfirmed({ locationRecord }) {
    const index = this.locationRecords.findIndex((br) => br.id === locationRecord.id);
    const updatedLocationRecords = [...this.locationRecords];
    updatedLocationRecords[index] = locationRecord;
    this.innerSetLocationRecords(updatedLocationRecords);
    this.emit('putLocationRecord', { locationRecord });
  }

  putLocationRecordsConfirmed({ locationRecords }) {
    // console.log('locationRecords', locationRecords);
    const locationRecordsIndex = R.indexBy(R.prop('id'), locationRecords);
    const updatedLocationRecords = this.locationRecords.map((locationRecord) => {
      const updatedLocationRecord = locationRecordsIndex[locationRecord.id];
      if (updatedLocationRecord) {
        return updatedLocationRecord;
      }
      return locationRecord;
    });
    // locationRecords.forEach((locationRecord) => {
    //   const index = this.locationRecords.findIndex((br) => br.id === locationRecord.id);
    //   this.locationRecords[index] = locationRecord;
    // });
    this.innerSetLocationRecords(updatedLocationRecords);
    this.emit('putLocationRecords', { locationRecords });
  }

  deleteLocationRecordConfirmed({ locationRecord }) {
    const updatedLocationRecords = this.locationRecords.filter((br) => br.id !== locationRecord.id);
    this.innerSetLocationRecords(updatedLocationRecords);
    this.emit('deleteLocationRecord', { locationRecord });
  }

  postLocationRecordConfirmed({ locationRecord }) {
    // console.log('postBeaconRecord');
    const updatedLocationRecords = [...this.locationRecords, locationRecord];
    this.innerSetLocationRecords(updatedLocationRecords);
    this.emit('postLocationRecord', { locationRecord });
  }
}
