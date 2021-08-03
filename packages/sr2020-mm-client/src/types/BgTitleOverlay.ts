import { L } from "sr2020-mm-client-core";

export interface BgTitleOverlayOptions extends L.ImageOverlayOptions {
  id: number;
}

export interface BgTitleOverlay extends L.SVGOverlay {
  constructor(svgImage: string | SVGElement, bounds: L.LatLngBoundsExpression, options?: BgTitleOverlayOptions): BgTitleOverlay;
  options: BgTitleOverlayOptions;
}

const BgTitleOverlayImpl = L.SVGOverlay.extend({
  options: {
    id: -1
  },
});

export function bgTitleOverlay(svgImage: string | SVGElement, bounds: L.LatLngBoundsExpression, options?: BgTitleOverlayOptions): BgTitleOverlay {
  // @ts-ignore
  return new BgTitleOverlayImpl(svgImage, bounds, options);
}
