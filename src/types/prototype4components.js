
import {
  number, string, func, arrayOf,
} from 'prop-types';

import {
  beacon2PropTypes,
  locationPropTypes,
} from './primitives';

import { dataServicePropTypes, spiritServicePropTypes } from './services';


export const Map2PropTypes = {
  dataService: dataServicePropTypes.isRequired,
};

export const SpiritEditorPropTypes = {
  spiritService: spiritServicePropTypes.isRequired,
};

export const SpiritContentPropTypes = {
  spiritService: spiritServicePropTypes.isRequired,
  id: number.isRequired,
};

export const SpiritListPropTypes = {
  spiritService: spiritServicePropTypes.isRequired,
  t: func.isRequired,
};

export const LocationPopupPropTypes = {
  name: string.isRequired,
  attachedMarkers: arrayOf(number).isRequired,
  allBeacons: arrayOf(beacon2PropTypes).isRequired,
  allLocations: arrayOf(locationPropTypes).isRequired,
  onLocMarkerChange: func.isRequired,
  onClose: func.isRequired,
  onChange: func.isRequired,
};

export const MarkerPopupPropTypes = {
  name: string.isRequired,
  lat: number.isRequired,
  lng: number.isRequired,
  onClose: func.isRequired,
  onChange: func.isRequired,
};

export const AbilitiesInputPropTypes = {
  spiritService: spiritServicePropTypes.isRequired,
  id: number.isRequired,
  t: func.isRequired,
  className: string,
};

export const SearchPropTypes = {
  onSearchChange: func.isRequired,
  t: func.isRequired,
  className: string.isRequired,
  placeholder: string.isRequired,
};
