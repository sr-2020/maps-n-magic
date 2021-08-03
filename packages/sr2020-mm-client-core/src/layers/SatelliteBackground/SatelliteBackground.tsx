import React, {
  Component, useState, useEffect, useContext,
} from 'react';
import './SatelliteBackground.css';

import L from 'leaflet';

import { LayerCommunicator } from "../../../index";

interface SatelliteBackgroundProps {
  enableByDefault: boolean; 
  layerCommunicator: LayerCommunicator;
  layerNameKey: string;
  tileLayerUrlTemplate: string;
  tileLayerOptions: L.TileLayerOptions;
}

export function SatelliteBackground(props: SatelliteBackgroundProps): null {
  const [group] = useState(L.layerGroup([]));
  const {
    enableByDefault, layerCommunicator, layerNameKey, tileLayerUrlTemplate, tileLayerOptions,
  } = props;

  useEffect(() => {
    layerCommunicator.emit('setLayersMeta', {
      layersMeta: {
        [layerNameKey]: group,
      },
      enableByDefault,
    });
    group.addLayer(L.tileLayer(tileLayerUrlTemplate, tileLayerOptions));
    return () => {
      group.clearLayers();
    };
  }, []);

  return null;
}
