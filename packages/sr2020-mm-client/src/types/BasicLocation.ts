import { L } from "sr2020-mm-client-core";

export interface BasicLocationOptions extends L.PolylineOptions {
  id: number;
  label: string;
  layer_id: number;
}

export interface BasicLocation extends L.Polygon {
  constructor(latlngs: L.LatLngExpression[] | L.LatLngExpression[][], options?: BasicLocationOptions): BasicLocation;
  options: BasicLocationOptions;
}

const BasicLocationImpl = L.Polygon.extend({
  options: {
    id: -1,
    label: '',
    layer_id: -1,
  },
});

export function basicLocation(
  latlngs: L.LatLngExpression[] | L.LatLngExpression[][], 
  options?: BasicLocationOptions
): BasicLocation {
  // @ts-ignore
  return new BasicLocationImpl(latlngs, options);
}