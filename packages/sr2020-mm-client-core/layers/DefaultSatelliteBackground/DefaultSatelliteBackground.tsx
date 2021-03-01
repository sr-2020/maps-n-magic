import React, {
  useContext,
} from 'react';
import { MapDefaultsContext } from '../../misc/mapDefaultsContext';
import { SatelliteBackground } from '../SatelliteBackground';

import './DefaultSatelliteBackground.css';

export function DefaultSatelliteBackground(props) {
  const {
    enableByDefault, layerCommunicator,
  } = props;
  const mapDefaults = useContext(MapDefaultsContext);
  const { urlTemplate, options } = mapDefaults.defaultTileLayer;
  return (
    <SatelliteBackground
      enableByDefault={enableByDefault}
      layerCommunicator={layerCommunicator}
      layerNameKey="defaultSatelliteLayer"
      tileLayerUrlTemplate={urlTemplate}
      tileLayerOptions={options}
    />
  );
}
