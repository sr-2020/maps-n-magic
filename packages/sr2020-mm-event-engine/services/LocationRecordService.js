import * as R from 'ramda';
import { Delaunay } from 'd3-delaunay';

import { getArrDiff, isGeoLocation, getPolygonCentroid } from '../utils';
import { AbstractService } from '../core/AbstractService';

// duplicated in LocationHolder
const defaultStyleOptions = {
  color: '#3388ff',
  weight: 3,
  fillOpacity: 0.2,
};

const extractPolygonData = (list) => list.filter(isGeoLocation).map(R.pick(['id', 'polygon']));

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
    requests: ['locationRecord', 'locationRecords'],
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

  // eslint-disable-next-line class-methods-use-this
  calcTriangulation(data) {
    const points = data.map((loc) => (loc.centroid = getPolygonCentroid(loc.polygon))).map(({ lat, lng }) => [lat, lng]);
    // console.log(points);

    const delaunay = Delaunay.from(points);
    this.neighborsIndex = data.reduce((acc, loc, i) => {
      const neighborsList = [...delaunay.neighbors(i)];
      // console.log(loc.id, neighborsIndex);
      acc.set(loc.id, neighborsList.map((index) => data[index].id));
      return acc;
    }, new Map());
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
