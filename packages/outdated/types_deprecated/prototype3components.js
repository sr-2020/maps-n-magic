import {
  number, string, func, array, node, bool,
  arrayOf,
} from 'prop-types';

import {
  polygonPropTypes, beaconPropTypes,
} from './primitives';

import { audioServicePropTypes } from './services';


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

export const BeaconsPropTypes = {
  beacons: arrayOf(beaconPropTypes).isRequired,
  setBeacons: func.isRequired,
  mainPolygon: polygonPropTypes.isRequired,
  setMainPolygon: func.isRequired,
  imagePositionX: number.isRequired,
  imagePositionY: number.isRequired,
  imageOpacity: number.isRequired,
  imageScale: number.isRequired,
  svgWidth: number.isRequired,
  svgHeight: number.isRequired,
  audioService: audioServicePropTypes.isRequired,
  imageUrl: string.isRequired,
};

export const PolygonTablePropTypes = {
  mainPolygon: polygonPropTypes.isRequired,
  onPointChange: func.isRequired,
};

export const SettingsFormPropTypes = {
  showBeaconMarkers: bool.isRequired,
  showPolygonLabels: bool.isRequired,
  showPolygonBoundaries: bool.isRequired,
  showMassCenters: bool.isRequired,
  showBeaconSignalArea: bool.isRequired,
  signalRadius: number.isRequired,
  enableAutoIteration: bool.isRequired,
  maxDelta: number.isRequired,
  showTracks: bool.isRequired,
  toggleCheckbox: func.isRequired,
  onStateChange: func.isRequired,
  nextIteration: func.isRequired,
  clearPolygon: func.isRequired,
  clearBeacons: func.isRequired,
  clearTracks: func.isRequired,
};

export const MapEditorPropTypes = {
  imagePositionX: number.isRequired,
  imagePositionY: number.isRequired,
  imageOpacity: number.isRequired,
  imageScale: number.isRequired,
  svgWidth: number.isRequired,
  svgHeight: number.isRequired,
  onPropChange: func.isRequired,
  mainPolygon: polygonPropTypes.isRequired,
  imageUrl: string.isRequired,
  toDefaultImageUrl: func.isRequired,
  setImageUrl: func.isRequired,
};

export const MapMarkerPropTypes = {
  x: number.isRequired,
  y: number.isRequired,
  id: string.isRequired,
  color: string,
  onClick: func.isRequired,
};

export const MapPointPropTypes = {
  x: number.isRequired,
  y: number.isRequired,
  fill: string,
  r: number,
};

export const Prototype1PropTypes = {
  beacons: arrayOf(beaconPropTypes).isRequired,
  svgWidth: number.isRequired,
  svgHeight: number.isRequired,
  audioService: audioServicePropTypes.isRequired,
};
