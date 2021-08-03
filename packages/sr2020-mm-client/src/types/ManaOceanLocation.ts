import { L } from "sr2020-mm-client-core";
import { LocationRecordOptions } from "sr2020-mm-event-engine";

export interface ManaOceanLocationOptions extends L.PolylineOptions {
  id: number;
  label: string;
  layer_id: number;
  locOptions: LocationRecordOptions;
}

export interface ManaOceanLocation extends L.Polygon {
  constructor(latlngs: L.LatLngExpression[] | L.LatLngExpression[][], options?: ManaOceanLocationOptions): ManaOceanLocation;
  options: ManaOceanLocationOptions;
}

const ManaOceanLocationImpl = L.Polygon.extend({
  options: {
    id: -1,
    label: '',
    layer_id: -1,
    locOptions: null
  },
});

export function manaOceanLocation(
  latlngs: L.LatLngExpression[] | L.LatLngExpression[][], 
  options?: ManaOceanLocationOptions
): ManaOceanLocation {
  // @ts-ignore
  return new ManaOceanLocationImpl(latlngs, options);
}