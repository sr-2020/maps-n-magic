import PropTypes, {
  shape, number, string, oneOf, func, object, array, node,
  arrayOf,
} from 'prop-types';

import { sequenceOf } from 'airbnb-prop-types';

const promise = shape({
  then: func.isRequired,
  catch: func.isRequired,
});

export const polygonPropTypes = arrayOf(sequenceOf({
  validator: number.isRequired,
  min: 2,
  max: 2,
}));

export const dataServicePropTypes = shape({
  getLocations: func.isRequired,
  getBeacons: func.isRequired,
  putLocation: func.isRequired,
  putBeacon: func.isRequired,
  getVoronoiPolygonData: func.isRequired,
  getAttachedBeaconIds: func.isRequired,
  deleteLocation: func.isRequired,
  deleteBeacon: func.isRequired,
  postLocation: func.isRequired,
  postBeacon: func.isRequired,
});

export const audioServicePropTypes = shape({
  toJson: func.isRequired,
  fromJson: func.isRequired,
  getBuffers: func.isRequired,
  isLoaded: promise.isRequired,
  addAudioFile: func.isRequired,
  removeSound: func.isRequired,
  startSound: func.isRequired,
  stopSound: func.isRequired,
  startSounds: func.isRequired,
  getSoundNames: func.isRequired,
  applyVolumes: func.isRequired,
  getSoundProps: func.isRequired,
});

export const MapPropTypes = {
  imagePositionX: number.isRequired,
  imagePositionY: number.isRequired,
  imageOpacity: number.isRequired,
  imageScale: number.isRequired,
  svgWidth: number.isRequired,
  svgHeight: number.isRequired,
  children: node.isRequired,
  onClick: func,
  imageUrl: string.isRequired,
};


export const Map2PropTypes = {
  dataService: dataServicePropTypes.isRequired,
};

export const BeaconTablePropTypes = {
  audioService: audioServicePropTypes.isRequired,
  beacons: array.isRequired,
  onTableHover: func.isRequired,
  onBeaconChange: func.isRequired,
  onBeaconPropChange: func.isRequired,
  onBeaconPropCheckboxChange: func.isRequired,
  onBeaconRemove: func.isRequired,
};

export const MainPolygonPropTypes = {
  mainPolygon: polygonPropTypes.isRequired,
};


const beaconPropTypes = PropTypes.shape({
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  props: PropTypes.shape({
    sound: PropTypes.string.isRequired,
  }).isRequired,
});

export const BeaconsPropTypes = {
  beacons: PropTypes.arrayOf(beaconPropTypes).isRequired,
  setBeacons: PropTypes.func.isRequired,
  mainPolygon: polygonPropTypes.isRequired,
  setMainPolygon: PropTypes.func.isRequired,
  imagePositionX: PropTypes.number.isRequired,
  imagePositionY: PropTypes.number.isRequired,
  imageOpacity: PropTypes.number.isRequired,
  imageScale: PropTypes.number.isRequired,
  svgWidth: PropTypes.number.isRequired,
  svgHeight: PropTypes.number.isRequired,
  audioService: audioServicePropTypes.isRequired,
  imageUrl: PropTypes.string.isRequired,
};

export const PolygonTablePropTypes = {
  mainPolygon: polygonPropTypes.isRequired,
  onPointChange: func.isRequired,
};


export const SettingsFormPropTypes = {
  showBeaconMarkers: PropTypes.bool.isRequired,
  showPolygonLabels: PropTypes.bool.isRequired,
  showPolygonBoundaries: PropTypes.bool.isRequired,
  showMassCenters: PropTypes.bool.isRequired,
  showBeaconSignalArea: PropTypes.bool.isRequired,
  signalRadius: PropTypes.number.isRequired,
  enableAutoIteration: PropTypes.bool.isRequired,
  maxDelta: PropTypes.number.isRequired,
  showTracks: PropTypes.bool.isRequired,
  toggleCheckbox: PropTypes.func.isRequired,
  onStateChange: PropTypes.func.isRequired,
  nextIteration: PropTypes.func.isRequired,
  clearPolygon: PropTypes.func.isRequired,
  clearBeacons: PropTypes.func.isRequired,
  clearTracks: PropTypes.func.isRequired,
};

export const childrenPropTypes = PropTypes.node;


// PropTypes.oneOfType([
//   PropTypes.shape({
//     type: PropTypes.node.isRequired,
//   }),
//   PropTypes.arrayOf(
//     PropTypes.shape({
//       type: PropTypes.node.isRequired,
//     })
//   ),
// ]);

export const ErrorBoundryPropTypes = {
  children: childrenPropTypes.isRequired,
};

const beacon2PropTypes = PropTypes.shape({
  name: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
});

const latLngPropTypes = PropTypes.shape({
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
});

const locationPropTypes = PropTypes.shape({
  name: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  markers: PropTypes.arrayOf(number).isRequired,
  latlngs: PropTypes.arrayOf(PropTypes.arrayOf(latLngPropTypes)).isRequired,
});

export const LocationPopupPropTypes = {
  name: PropTypes.string.isRequired,
  attachedMarkers: PropTypes.arrayOf(number).isRequired,
  allBeacons: PropTypes.arrayOf(beacon2PropTypes).isRequired,
  allLocations: PropTypes.arrayOf(locationPropTypes).isRequired,
  onLocMarkerChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

export const MarkerPopupPropTypes = {
  name: PropTypes.string.isRequired,
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

export const MapEditorPropTypes = {
  imagePositionX: PropTypes.number.isRequired,
  imagePositionY: PropTypes.number.isRequired,
  imageOpacity: PropTypes.number.isRequired,
  imageScale: PropTypes.number.isRequired,
  svgWidth: PropTypes.number.isRequired,
  svgHeight: PropTypes.number.isRequired,
  onPropChange: PropTypes.func.isRequired,
  mainPolygon: polygonPropTypes.isRequired,
  imageUrl: PropTypes.string.isRequired,
  toDefaultImageUrl: PropTypes.func.isRequired,
  setImageUrl: PropTypes.func.isRequired,
};

export const MapMarkerPropTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  color: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

export const MapPointPropTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  fill: PropTypes.string,
  r: PropTypes.number,
};

export const MusicEditorPropTypes = {
  audioService: audioServicePropTypes.isRequired,
};

export const Prototype1PropTypes = {
  beacons: PropTypes.arrayOf(beaconPropTypes).isRequired,
  svgWidth: PropTypes.number.isRequired,
  svgHeight: PropTypes.number.isRequired,
  audioService: audioServicePropTypes.isRequired,
};
