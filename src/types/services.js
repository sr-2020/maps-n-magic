
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
  getSpirits: func.isRequired,
  putSpirit: func.isRequired,
  postSpirit: func.isRequired,
  deleteSpirit: func.isRequired,
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
