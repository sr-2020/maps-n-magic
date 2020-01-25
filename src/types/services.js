
import {
  shape, func,
} from 'prop-types';

import { promise } from './primitives';

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

export const spiritServicePropTypes = shape({
  execute: func.isRequired,
  get: func.isRequired,
  // getSpirits: func.isRequired,
  // putSpirit: func.isRequired,
  // postSpirit: func.isRequired,
  // deleteSpirit: func.isRequired,
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

export const soundServicePropTypes = shape({
  getSounds: func.isRequired,
  on: func.isRequired,
  stopAllSounds: func.isRequired,
  canPlaySound: func.isRequired,
  playSound: func.isRequired,
  isPlayingSound: func.isRequired,
  loadSound: func.isRequired,
});

export const gameModelPropTypes = shape({
  get: func.isRequired,
  execute: func.isRequired,
});
