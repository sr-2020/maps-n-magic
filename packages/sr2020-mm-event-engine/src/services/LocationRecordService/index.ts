import * as R from 'ramda';

import {
  getArrDiff, isGeoLocation, sample,
} from '../../utils';
import { makeTriangulationData } from '../../utils/makeTriangulationData';
import { TriangulationData, LocationRecord, defaultLocationStyleOptions } from "../../domain";

import { 
  AbstractService, 
  Metadata, 
  GameModel, 
  GMLogger,
  Req,
  Res
} from '../../core';

import { 
  lrsMetadata,
  GetLocationRecords,
  GetLocationRecord,
  GetTriangulationData,
  GetNeighborList,
  GetNeighborOrRandomLocation,
  SetLocationRecords,
  PutLocationRecords,
  PutLocationRecordsConfirmed,
  PutLocationRecord,
  PutLocationRecordConfirmed,
  PostLocationRecord,
  PostLocationRecordConfirmed,
  DeleteLocationRecord,
  DeleteLocationRecordConfirmed,
  LocationRecordEvents,
  LocationRecordServiceContract
} from "./types";

const extractPolygonData = (list: LocationRecord[]): Pick<LocationRecord, 'id'|'polygon'>[] => 
  list.filter(isGeoLocation).map(R.pick(['id', 'polygon']));

type LocationRecordsObj = {locationRecords: LocationRecord[]};

export class LocationRecordService extends AbstractService<LocationRecordServiceContract> {
  locationRecords: LocationRecord[];

  neighborsIndex: TriangulationData | null;

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(lrsMetadata);
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
        ...defaultLocationStyleOptions,
        ...loc.options,
      };
    });
  }

  // getData(): LocationRecordsObj {
  //   return {
  //     locationRecords: this.getLocationRecords(),
  //   };
  // }

  getLocationRecords(request: Req<GetLocationRecords>): Res<GetLocationRecords> {
    return [...this.locationRecords];
  }

  getLocationRecord({ id }: Req<GetLocationRecord>): Res<GetLocationRecord> {
    const locationRecord = this.locationRecords.find((br) => br.id === id);
    if (locationRecord === undefined) {
      this.logger.error('location record not found, locationId', id);
      
      // try {
      //   throw new Error('location record not found, locationId ' + id)
      // } catch(err) {
      //   this.logger.error(err)
      // }
      return null;
      // this.logger.info(R.pluck('id', this.locationRecords));
    }
    return R.clone(locationRecord);
  }

  setLocationRecords({ locationRecords }: SetLocationRecords): void {
    // this.logger.info('setLocationRecords');
    this.setData({ locationRecords });
    this.emit2({
      locationRecords,
      type: 'locationRecordsChanged'
    });
    this.emit2({
      type: 'locationRecordsChanged2',
      locationRecords,
    });
  }

  private innerSetLocationRecords(locationRecords: LocationRecord[]): void {
    this.updateTriangulation(locationRecords, this.locationRecords);
    this.locationRecords = locationRecords;
    this.emit2({
      type: 'locationRecordsChanged2',
      locationRecords,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private updateTriangulation(locationRecords: LocationRecord[], prevLocations: LocationRecord[]): void {
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

  getTriangulationData(request: Req<GetTriangulationData>): Res<GetTriangulationData> {
    return this.neighborsIndex;
  }

  getNeighborList({ locationId }: Req<GetNeighborList>): Res<GetNeighborList> {
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

  getNeighborOrRandomLocation(
    { locationId }: Req<GetNeighborOrRandomLocation>
  ): Res<GetNeighborOrRandomLocation> {
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
    return this.getLocationRecord({ 
      type: 'locationRecord',
      id: neighborLocationId
    });
  }

  postLocationRecord = (action: PostLocationRecord): void => {
    this.emit2({
      ...action,
      type: 'postLocationRecordRequested'
    });
  }

  postLocationRecordConfirmed({ locationRecord }: PostLocationRecordConfirmed): void {
    // console.log('postBeaconRecord');
    const updatedLocationRecords = [...this.locationRecords, locationRecord];
    this.innerSetLocationRecords(updatedLocationRecords);
    this.emit2({ 
      locationRecord,
      type: 'postLocationRecord'
    });
  }

  putLocationRecord(action: PutLocationRecord): void {
    this.emit2({
      ...action,
      type: 'putLocationRecordRequested'
    });
  }

  putLocationRecordConfirmed({ locationRecord }: PutLocationRecordConfirmed): void {
    const index = this.locationRecords.findIndex((br) => br.id === locationRecord.id);
    const updatedLocationRecords = [...this.locationRecords];
    updatedLocationRecords[index] = locationRecord;
    this.innerSetLocationRecords(updatedLocationRecords);
    this.emit2({
      type: 'putLocationRecord',
      locationRecord 
    });
  }

  deleteLocationRecord = (action: DeleteLocationRecord): void => {
    this.emit2({
      ...action,
      type: 'deleteLocationRecordRequested'
    });
  }

  deleteLocationRecordConfirmed({ locationRecord }: DeleteLocationRecordConfirmed): void {
    const updatedLocationRecords = this.locationRecords.filter((br) => br.id !== locationRecord.id);
    this.innerSetLocationRecords(updatedLocationRecords);
    this.emit2({ 
      locationRecord,
      type: 'deleteLocationRecord'
    });
  }

  putLocationRecords(action: PutLocationRecords): void {
    this.emit2({
      ...action,
      type: 'putLocationRecordsRequested'
    });
  }

  putLocationRecordsConfirmed({ locationRecords }: PutLocationRecordsConfirmed): void {
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
    this.emit2({ 
      type: 'putLocationRecords',
      locationRecords 
    });
  }


}
