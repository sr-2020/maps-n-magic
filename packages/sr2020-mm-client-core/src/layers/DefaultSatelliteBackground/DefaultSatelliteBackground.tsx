import React, {
  useContext,
} from 'react';
import { MapDefaultsContext } from '../../misc/mapDefaultsContext';
import { SatelliteBackground } from '../SatelliteBackground';
import { LayerCommunicator } from "../../../index";

import './DefaultSatelliteBackground.css';

interface DefaultSatelliteBackground {
  enableByDefault: boolean;
  layerCommunicator: LayerCommunicator;
}

export function DefaultSatelliteBackground(props: DefaultSatelliteBackground) {
  const {
    enableByDefault, layerCommunicator,
  } = props;
  const mapDefaults = useContext(MapDefaultsContext);
  if(!mapDefaults) {
    return null;
  }
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
