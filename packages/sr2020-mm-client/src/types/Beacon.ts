import { L } from "sr2020-mm-client-core";

export interface BeaconOptions extends L.MarkerOptions {
  id: number;
  label: string;
}

export interface Beacon extends L.Marker {
  constructor(latlng: L.LatLngExpression, options?: BeaconOptions): Beacon;
  options: BeaconOptions;
}

const BeaconImpl = L.Marker.extend({
  options: {
    id: -1,
    label: ''
  },
});

export function makeBeacon(latlng: L.LatLngExpression, options?: BeaconOptions): Beacon {
  // @ts-ignore
  return new BeaconImpl(latlng, options);
}