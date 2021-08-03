import React from 'react';
import * as R from 'ramda';
import { BeaconRecord, LatLngBeaconRecord } from 'sr2020-mm-event-engine';

export interface WithLatLngBeacons {
  latLngBeaconRecords: LatLngBeaconRecord[];
}

const isLatLngBeacon = (beacon: BeaconRecord) => beacon.lat !== null && beacon.lat !== 0
  && beacon.lng !== null && beacon.lng !== 0;

const filterBeacons = R.filter(isLatLngBeacon);

export const withLatLngBeacons = (Wrapped: any) => (props: {
  beaconRecords: BeaconRecord[]
}) => {
  const { beaconRecords } = props;

  return (
    <Wrapped
      {...props}
      latLngBeaconRecords={beaconRecords && filterBeacons(beaconRecords)}
    />
  );
};
