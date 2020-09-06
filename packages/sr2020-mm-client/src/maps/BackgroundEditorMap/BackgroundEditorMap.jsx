import React from 'react';
import './BackgroundEditorMap.css';

import { Map } from '../Map';

import { SatelliteBackground } from '../../layers/SatelliteBackground';
import { BaseContourLayer2 } from '../../layers/BaseContourLayer2';
import { BackgroundImageLayer } from '../../layers/BackgroundImageLayer';
import { GeoJsonLayer } from '../../layers/GeoJsonLayer';

// import { BackgroundEditorMapPropTypes } from '../../types';

export function BackgroundEditorMap(props) {
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
        editable
      />
      <GeoJsonLayer
        enableByDefault
      />
    </Map>
  );
}

// BackgroundEditorMap.propTypes = BackgroundEditorMapPropTypes;
