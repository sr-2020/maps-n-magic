import React from 'react';
import * as R from 'ramda';

import { isGeoLocation, LocationRecord, BeaconRecord } from 'sr2020-mm-event-engine';

const sortById = R.sortBy(R.prop('id'));
const sortByLabel = R.sortBy(R.prop('id'));

export const withSortDataHOC = (Wrapped) => (props) => {
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
