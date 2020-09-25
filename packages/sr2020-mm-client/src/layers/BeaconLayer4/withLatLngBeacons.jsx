import React from 'react';
import * as R from 'ramda';

const isLatLngBeacon = (beacon) => beacon.lat !== null && beacon.lat !== 0
  && beacon.lng !== null && beacon.lng !== 0;

const filterBeacons = R.filter(isLatLngBeacon);

export const withLatLngBeacons = (Wrapped) => (props) => {
  const { beaconRecords } = props;

  return (
    <Wrapped
      {...props}
      latLngBeaconRecords={beaconRecords && filterBeacons(beaconRecords)}
    />
  );
};
