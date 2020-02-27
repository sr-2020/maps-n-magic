import React from 'react';
import './BackgroundEditorMap.css';

import { Map2 } from '../Map2';

import { SatelliteBackground } from '../layers/SatelliteBackground';
import { BaseContourLayer2 } from '../layers/BaseContourLayer2';
import { BackgroundImageLayer } from '../layers/BackgroundImageLayer';

// import { BackgroundEditorMapPropTypes } from '../../types';

export function BackgroundEditorMap(props) {
  const {
    curPosition, gameModel, mapConfig, translator, geomanConfig,
  } = props;

  return (
    <Map2
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
      />
    </Map2>
  );
}

// BackgroundEditorMap.propTypes = BackgroundEditorMapPropTypes;
