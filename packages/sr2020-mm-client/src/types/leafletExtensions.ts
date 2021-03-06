import { L } from "sr2020-mm-client-core";

// Background image overlay

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

// Background title overlay

export interface BgTitleOverlayOptions extends L.ImageOverlayOptions {
  id: number;
}

export interface BgTitleOverlay extends L.SVGOverlay {
  constructor(svgImage: string | SVGElement, bounds: L.LatLngBoundsExpression, options?: BgTitleOverlayOptions);
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

// Background rectangle

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

// Beacon

export interface BeaconOptions extends L.MarkerOptions {
  id: number;
  label: string;
}

export interface Beacon extends L.Marker {
  constructor(latlng: L.LatLngExpression, options?: BeaconOptions);
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