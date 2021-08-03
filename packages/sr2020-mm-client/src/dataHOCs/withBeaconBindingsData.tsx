import React, { useState, useEffect } from 'react';
import * as R from 'ramda';
import { WithGeoLocationRecords } from './withGeoLocationRecords';
import { WithBeaconRecords } from '.';
import { BeaconRecord, getPolygonCentroid, LocationRecord } from 'sr2020-mm-event-engine';

export interface BeaconBinding {
  id: string;
  beaconLatLng1: L.LatLngLiteral;
  locCentroidLatLng2: L.LatLngLiteral;
}

export interface WithBeaconBindingsData {
  beaconBindings: BeaconBinding[];
}

export const withBeaconBindingsData = (Wrapped: any) => (props: any) => {
  const { geoLocationRecords } = props as WithGeoLocationRecords;
  const { beaconRecords } = props as WithBeaconRecords;
  const beaconBindings = getCombinedData(geoLocationRecords, beaconRecords);
  return <Wrapped {...props} beaconBindings={beaconBindings} />;
};

function getCombinedData(
  geoLocationRecords: LocationRecord[], 
  beaconRecords: BeaconRecord[] 
): BeaconBinding[] {

  const locationIndex = R.indexBy(R.prop('id'),geoLocationRecords);

  return beaconRecords.reduce((acc: BeaconBinding[], beaconRecord: BeaconRecord ) => {
    const { location_id, lat, lng } = beaconRecord;
    
    if (
      location_id !== null 
      && lat !== null 
      && lng !== null 
      && locationIndex[location_id] !== undefined
    ) {
      const locationRecord = locationIndex[location_id];
      const centroid = getPolygonCentroid(locationRecord.polygon);
      acc.push({
        id: beaconRecord.id + '-' + locationRecord.id,
        beaconLatLng1: {
          lat,
          lng
        },
        locCentroidLatLng2: centroid
      });
    }

    return acc;
  }, []);
}