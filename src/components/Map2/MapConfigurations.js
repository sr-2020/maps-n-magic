const maxZoom = 20;

const osmTileLayer = {
  urlTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  options: {
    attribution: '&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    maxZoom,
  }
};

const googleTileLayer = {
  urlTemplate: 'http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
  options: {
    maxZoom,
    opacity: 0.4,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
  }
};

const mapConfig = {
  lat: 54.928743,
  lng: 36.871746,
  center: [54.928743, 36.871746],
  zoom: 17,
};

const geomanConfig = {
  position: 'topleft',
  drawCircleMarker: false,
  drawPolyline: false,
  cutPolygon: false,
  drawCircle: false,
  drawRectangle: false
};

// osmSettings
// const getTileConfiguration = () => googleSettings;

const defaultTileLayer = googleTileLayer;


export {
  osmTileLayer, googleTileLayer, mapConfig, geomanConfig, defaultTileLayer
};
