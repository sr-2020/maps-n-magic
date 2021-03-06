import { L } from "sr2020-mm-client-core";

export interface BgRectangleOptions extends L.PolylineOptions {
  image: string;
  id: number;
  name: string;
}

export interface BgRectangle extends L.Rectangle {
  constructor(latLngBounds: L.LatLngBoundsExpression, options?: BgRectangleOptions);
  options: BgRectangleOptions;
}

const BgRectangleImpl = L.Rectangle.extend({
  options: {
    id: -1,
    image: '',
    name: ''
  },
});

export function bgRectangle(latLngBounds: L.LatLngBoundsExpression, options?: BgRectangleOptions): BgRectangle {
  // @ts-ignore
  return new BgRectangleImpl(latLngBounds, options);
}