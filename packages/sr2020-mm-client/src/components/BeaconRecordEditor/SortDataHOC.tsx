import React from 'react';
import * as R from 'ramda';

import { isGeoLocation, LocationRecord, BeaconRecord } from 'sr2020-mm-event-engine';

const sortById = R.sortBy(R.prop('id'));
const sortByLabel = R.sortBy(R.prop('id'));

export interface WithSortDataHOC {
  beaconRecords: BeaconRecord[];
  sortedLocationList: LocationRecord[]
}

export const withSortDataHOC = (Wrapped: any) => (props: any) => {
  const { 
    locationRecords, 
    beaconRecords
  }: {
    locationRecords: LocationRecord[],
    beaconRecords: BeaconRecord[]
  } = props;
  const geoLocations = locationRecords.filter(isGeoLocation);
  const sortedLocationList = sortByLabel(geoLocations);

  return (
    <Wrapped
      {...props}
      beaconRecords={sortById([...beaconRecords])}
      sortedLocationList={sortedLocationList}
    />
  );
};
