import { L } from "sr2020-mm-client-core";

export interface LocationCentroidOptions extends L.MarkerOptions {
  locationId: number;
}

export interface LocationCentroid extends L.Marker {
  constructor(latlng: L.LatLngExpression, options?: LocationCentroidOptions);
  options: LocationCentroidOptions;
}

const LocationCentroidImpl = L.Marker.extend({
  options: {
    locationId: -1,
  },
});

export function makeLocationCentroid(
  latlng: L.LatLngExpression, 
  options?: LocationCentroidOptions
): LocationCentroid {
  // @ts-ignore
  return new LocationCentroidImpl(latlng, options);
}