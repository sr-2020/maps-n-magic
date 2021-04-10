import { L } from "sr2020-mm-client-core";

export interface LocNeighborLineOptions extends L.PolylineOptions {
  edgeId: string;
}

export interface LocNeighborLine extends L.Polyline {
  constructor(latlngs: L.LatLngExpression[] | L.LatLngExpression[][], options?: LocNeighborLineOptions): LocNeighborLine;
  options: LocNeighborLineOptions;
}

const LocNeighborLineImpl = L.Polyline.extend({
  options: {
    edgeId: '',
  },
});

export function locNeighborLine(
  latlngs: L.LatLngExpression[] | L.LatLngExpression[][], 
  options?: LocNeighborLineOptions
): LocNeighborLine {
  // @ts-ignore
  return new LocNeighborLineImpl(latlngs, options);
}