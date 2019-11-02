import {
  shape, number, string, oneOf, func, object, array, node,
  arrayOf
} from 'prop-types';

import { sequenceOf } from 'airbnb-prop-types';

const promise = shape({
  then: func.isRequired,
  catch: func.isRequired
});

const polygonPropTypes = arrayOf(sequenceOf({
  validator: number.isRequired,
  min: 2,
  max: 2
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
  onClick: func.isRequired,
  imageUrl: string.isRequired
};


export const Map2PropTypes = {
  dataService: dataServicePropTypes.isRequired
};

export const BeaconTablePropTypes = {
  audioService: audioServicePropTypes.isRequired,
  beacons: array.isRequired,
  onTableHover: func.isRequired,
  onBeaconChange: func.isRequired,
  onBeaconPropChange: func.isRequired,
  onBeaconPropCheckboxChange: func.isRequired,
  onBeaconRemove: func.isRequired
};

export const MainPolygonPropTypes = {
  mainPolygon: polygonPropTypes.isRequired
};
