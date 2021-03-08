import * as R from 'ramda';

import {
  getArrDiff, isGeoLocation, sample,
} from '../utils';
import { makeTriangulationData } from '../utils/makeTriangulationData';
import { LocationRecord, TriangulationData } from "../types";

import { 
  AbstractService, 
  Metadata, 
  GameModel, 
  GMLogger 
} from '../core';

// duplicated in LocationHolder
const defaultStyleOptions = {
  color: '#3388ff',
  weight: 3,
  fillOpacity: 0.2,
};

const extractPolygonData = (list: LocationRecord[]) => list.filter(isGeoLocation).map(R.pick(['id', 'polygon']));

const metadata: Metadata = {
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
  requests: [
    'locationRecord',
    'locationRecords',
    'triangulationData',
    'neighborOrRandomLocation',
    'neighborList',
  ],
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
  needActions: [],
  needRequests: []
};

type LocationRecordsObj = {locationRecords: LocationRecord[]};
type LocationRecordObj = {locationRecord: LocationRecord};
type LocationIdObj = {locationId: number};

export class LocationRecordService extends AbstractService {
  locationRecords: LocationRecord[];

  neighborsIndex: TriangulationData | null;

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(metadata);
    this.locationRecords = [];
    this.neighborsIndex = null;
  }

  setData(
    { locationRecords }: LocationRecordsObj = { locationRecords: [] }
  ): void {
    this.updateTriangulation(locationRecords, this.locationRecords);
    this.locationRecords = locationRecords;
    this.locationRecords.forEach((loc) => {
      loc.options = {
        ...defaultStyleOptions,
        ...loc.options,
      };
    });
  }

  getData(): LocationRecordsObj {
    return {
      locationRecords: this.getLocationRecords(),
    };
  }

  getLocationRecords(): LocationRecord[] {
    return [...this.locationRecords];
  }

  getLocationRecord({ id }: { id: number }): LocationRecord | null {
    const locationRecord = this.locationRecords.find((br) => br.id === id);
    if (locationRecord === undefined) {
      this.logger.error('location record not found, locationId', id);
      return null;
      // this.logger.info(R.pluck('id', this.locationRecords));
    }
    return R.clone(locationRecord);
  }

  setLocationRecords({ locationRecords }: LocationRecordsObj): void {
    this.setData({ locationRecords });
    this.emit('locationRecordsChanged', {
      locationRecords,
    });
    this.emit('locationRecordsChanged2', {
      type: 'locationRecordsChanged2',
      locationRecords,
    });
  }

  innerSetLocationRecords(locationRecords: LocationRecord[]): void {
    this.updateTriangulation(locationRecords, this.locationRecords);
    this.locationRecords = locationRecords;
    this.emit('locationRecordsChanged2', {
      type: 'locationRecordsChanged2',
      locationRecords,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  updateTriangulation(locationRecords: LocationRecord[], prevLocations: LocationRecord[]): void {
    const prevData = extractPolygonData(prevLocations);
    const nextData = extractPolygonData(locationRecords);
    const { unchanged } = getArrDiff(nextData, prevData, R.prop('id'));
    if (!this.neighborsIndex) {
      this.neighborsIndex = makeTriangulationData(nextData);
      return;
    }
    if (prevData.length === unchanged.length
      && prevData.length === nextData.length
    ) {
      // console.log('no location changes');
    } else {
      // console.log('detected location changes');
      this.neighborsIndex = makeTriangulationData(nextData);
    }
  }

  getTriangulationData(): TriangulationData | null {
    return this.neighborsIndex;
  }

  getNeighborList({ locationId }: LocationIdObj): LocationRecord[] {
    if(this.neighborsIndex === null) {
      return [];
    }
    const { neighborsIndex } = this.neighborsIndex;
    // console.log('neighborsIndex', neighborsIndex);
    const neighborsIdList = neighborsIndex.get(Number(locationId)) || [];
    if (neighborsIdList.length === 0) {
      return [];
    }
    const neighborList = this.locationRecords.filter((el) => neighborsIdList.includes(el.id));
    return neighborList;
  }

  getNeighborOrRandomLocation({ locationId }: LocationIdObj): LocationRecord | null {
    if(this.neighborsIndex === null) {
      return null;
    }
    const { neighborsIndex } = this.neighborsIndex;
    // console.log(neighborsIndex);
    let neighborsList: number[] = neighborsIndex.get(Number(locationId)) || [];
    // If location has no neighbors take all available loc ids except locationId one.
    if (neighborsList.length === 0) {
      neighborsList = R.without([locationId], Array.from(neighborsIndex.keys()));
    }

    const neighborLocationId: number = sample(neighborsList);
    if (neighborLocationId === null) {
      return null;
    }
    return this.getLocationRecord({ id: neighborLocationId });
  }

  putLocationRecord(action: unknown): void {
    this.emit('putLocationRecordRequested', action);
  }

  putLocationRecords(action: unknown): void {
    this.emit('putLocationRecordsRequested', action);
  }

  postLocationRecord = (action: unknown): void => {
    this.emit('postLocationRecordRequested', action);
  }

  deleteLocationRecord = (action: unknown): void => {
    this.emit('deleteLocationRecordRequested', action);
  }

  putLocationRecordConfirmed({ locationRecord }: LocationRecordObj): void {
    const index = this.locationRecords.findIndex((br) => br.id === locationRecord.id);
    const updatedLocationRecords = [...this.locationRecords];
    updatedLocationRecords[index] = locationRecord;
    this.innerSetLocationRecords(updatedLocationRecords);
    this.emit('putLocationRecord', { locationRecord });
  }

  putLocationRecordsConfirmed({ locationRecords }: LocationRecordsObj): void {
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

  deleteLocationRecordConfirmed({ locationRecord }: LocationRecordObj): void {
    const updatedLocationRecords = this.locationRecords.filter((br) => br.id !== locationRecord.id);
    this.innerSetLocationRecords(updatedLocationRecords);
    this.emit('deleteLocationRecord', { locationRecord });
  }

  postLocationRecordConfirmed({ locationRecord }: LocationRecordObj): void {
    // console.log('postBeaconRecord');
    const updatedLocationRecords = [...this.locationRecords, locationRecord];
    this.innerSetLocationRecords(updatedLocationRecords);
    this.emit('postLocationRecord', { locationRecord });
  }
}
