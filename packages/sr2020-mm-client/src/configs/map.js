const maxZoom = 20;

const osmTileLayer = {
  urlTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  options: {
    attribution: '&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    maxZoom,
  },
};

const googleTileLayer = {
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
};

// initial data config
// const mapConfig = {
//   lat: 54.92822999834723,
//   // lng: 36.87105243803666,
//   lng: 36.87455243803666,
//   zoom: 17,
// };

mapConfig.center = [mapConfig.lat, mapConfig.lng];

export const defaultCenter = mapConfig.center;
export const defaultZoom = mapConfig.zoom;

const defaultGeomanFeatures = {
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
  pinningOption: false,
  snappingOption: false,
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

const oldLocationAndMarkerGeomanConfig = {
  ...defaultGeomanFeatures,
  ...markerEditorGeomanFeatures,
  ...locationEditorGeomanFeatures,
};

const backgroundEditorGeomanConfig = {
  ...defaultGeomanFeatures,
  drawRectangle: true,
  editMode: true,
  dragMode: true,
  removalMode: true,
};

const locationsEditor2GeomanConfig = {
  ...defaultGeomanFeatures,
  ...locationEditorGeomanFeatures,
};

const beaconEditor2GeomanConfig = {
  ...defaultGeomanFeatures,
  ...markerEditorGeomanFeatures,
};

// osmSettings
// const getTileConfiguration = () => googleSettings;

const defaultTileLayer = googleTileLayer;

export {
  osmTileLayer, googleTileLayer, mapConfig, defaultTileLayer, backgroundEditorGeomanConfig,
  oldLocationAndMarkerGeomanConfig, locationsEditor2GeomanConfig, beaconEditor2GeomanConfig,
};
