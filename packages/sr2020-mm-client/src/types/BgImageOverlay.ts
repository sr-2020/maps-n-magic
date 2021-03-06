import { L } from "sr2020-mm-client-core";

export interface BgImageOverlayOptions extends L.ImageOverlayOptions {
  id: number;
}

export interface BgImageOverlay extends L.ImageOverlay {
  constructor(imageUrl: string, bounds: L.LatLngBoundsExpression, options?: BgImageOverlayOptions);
  options: BgImageOverlayOptions;
}

const BgImageOverlayImpl = L.ImageOverlay.extend({
  options: {
    id: -1
  },
});

export function bgImageOverlay(imageUrl: string, bounds: L.LatLngBoundsExpression, options?: BgImageOverlayOptions): BgImageOverlay {
  // @ts-ignore
  return new BgImageOverlayImpl(imageUrl, bounds, options);
}