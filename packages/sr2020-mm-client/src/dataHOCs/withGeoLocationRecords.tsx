
import React, { useState, useEffect } from 'react';
import * as R from 'ramda';
import { 
  isGeoLocation, 
  LocationRecord,
  isNotEmptyPolygon
} from "sr2020-mm-event-engine";

import { WithLocationRecords } from "./index";

export interface WithGeoLocationRecords {
  geoLocationRecords: LocationRecord[];
}

const sortById = R.sortBy(R.prop('id'));

const filterLocationRecords = R.pipe(
  R.filter(isGeoLocation),
  R.filter(isNotEmptyPolygon),
);

export const withGeoLocationRecords = (Wrapped: any) => (props: any) => {
  const { locationRecords } = props as WithLocationRecords;
  const geoLocationRecords = sortById(filterLocationRecords(locationRecords));
  return <Wrapped {...props} geoLocationRecords={geoLocationRecords} />;
};