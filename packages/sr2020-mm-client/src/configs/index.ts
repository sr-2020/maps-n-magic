import { L, TileLayerData, MapDefaults } from "sr2020-mm-client-core";

const maxZoom: number = 20;

const osmTileLayer: TileLayerData = {
  urlTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  options: {
    attribution: '&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    maxZoom,
  },
};

const googleTileLayer: TileLayerData = {
  urlTemplate: 'http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
  options: {
    maxZoom,
    opacity: 0.4,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  },
};

// SR Amur settings
const mapConfig = {
  lat: 54.92912999834723,
  // lng: 36.87105243803666,
  lng: 36.87405243803666,
  zoom: 17,
  center: [0, 0] as [number, number]
};

// initial data config
// const mapConfig = {
//   lat: 54.92822999834723,
//   // lng: 36.87105243803666,
//   lng: 36.87455243803666,
//   zoom: 17,
// };

mapConfig.center = [mapConfig.lat, mapConfig.lng];

export const defaultCenter: [number, number] = mapConfig.center;

const defaultGeomanFeatures: L.PM.DrawControlOptions = {
  position: 'topleft',
  drawMarker: false,
  drawCircleMarker: false,
  drawPolyline: false,
  drawRectangle: false,
  drawPolygon: false,
  drawCircle: false,
  editMode: false,
  dragMode: false,
  cutPolygon: false,
  removalMode: false,
  // pinningOption: false,
  // snappingOption: false,
};

const markerEditorGeomanFeatures = {
  drawMarker: true,
  editMode: true,
  dragMode: true,
  removalMode: true,
};

const locationEditorGeomanFeatures = {
  drawPolygon: true,
  editMode: true,
  dragMode: true,
  removalMode: true,
};

const oldLocationAndMarkerGeomanConfig: L.PM.DrawControlOptions = {
  ...defaultGeomanFeatures,
  ...markerEditorGeomanFeatures,
  ...locationEditorGeomanFeatures,
};

export const backgroundEditorGeomanConfig: L.PM.DrawControlOptions = {
  ...defaultGeomanFeatures,
  drawRectangle: true,
  editMode: true,
  dragMode: true,
  removalMode: true,
};

export const locationsEditor2GeomanConfig: L.PM.DrawControlOptions = {
  ...defaultGeomanFeatures,
  ...locationEditorGeomanFeatures,
};

export const beaconEditor2GeomanConfig: L.PM.DrawControlOptions = {
  ...defaultGeomanFeatures,
  ...markerEditorGeomanFeatures,
};

export const mapDefaults: MapDefaults = {
  defaultTileLayer: googleTileLayer,
  defaultZoom: mapConfig.zoom,
  defaultCenter: mapConfig.center
}
