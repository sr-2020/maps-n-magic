import React from 'react';
import './LocationEditorMap.css';

import { Map } from '../Map';

import { SatelliteBackground } from '../layers/SatelliteBackground';
import { BaseContourLayer2 } from '../layers/BaseContourLayer2';
import { BackgroundImageLayer } from '../layers/BackgroundImageLayer';
import { GeoJsonLayer } from '../layers/GeoJsonLayer';
import { LocationLayer3 } from '../layers/LocationLayer3';

// import { LocationEditorMapPropTypes } from '../../types';

export function LocationEditorMap(props) {
  const {
    curPosition, gameModel, mapConfig, translator, geomanConfig,
  } = props;

  return (
    <Map
      curPosition={curPosition}
      gameModel={gameModel}
      mapConfig={mapConfig}
      geomanConfig={geomanConfig}
      commonPropsExtension={{
        translator,
        gameModel,
      }}
    >
      <SatelliteBackground enableByDefault />
      <BaseContourLayer2
        enableByDefault
      />
      <BackgroundImageLayer
        enableByDefault
        editable={false}
      />
      <GeoJsonLayer
        enableByDefault={false}
      />
      <LocationLayer3
        enableByDefault
      />
    </Map>
  );
}

// LocationEditorMap.propTypes = LocationEditorMapPropTypes;
