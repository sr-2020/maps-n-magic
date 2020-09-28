import React from 'react';
import * as R from 'ramda';

import { isGeoLocation } from 'sr2020-mm-event-engine/utils';

const sortById = R.sortBy(R.prop('id'));
const sortByLabel = R.sortBy(R.prop('id'));

export const withSortDataHOC = (Wrapped) => (props) => {
  const { locationRecords, beaconRecords } = props;
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
