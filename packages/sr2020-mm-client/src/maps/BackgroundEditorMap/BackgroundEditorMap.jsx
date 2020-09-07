import React from 'react';
import './BackgroundEditorMap.css';

import { Map } from '../Map';

import { DefaultSatelliteBackground } from '../../layers/DefaultSatelliteBackground';
import { BaseContourLayer2 } from '../../layers/BaseContourLayer2';
import { BackgroundImageLayer } from '../../layers/BackgroundImageLayer';
import { GeoJsonLayer } from '../../layers/GeoJsonLayer';

// import { BackgroundEditorMapPropTypes } from '../../types';

export function BackgroundEditorMap(props) {
  const {
    gameModel, geomanConfig,
  } = props;

  return (
    <Map
      gameModel={gameModel}
      geomanConfig={geomanConfig}
      commonPropsExtension={{
        gameModel,
      }}
    >
      <DefaultSatelliteBackground enableByDefault />
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
