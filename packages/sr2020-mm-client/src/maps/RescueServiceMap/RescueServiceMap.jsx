import React from 'react';
import './RescueServiceMap.css';

import { Map } from '../Map';

import { SatelliteBackground } from '../layers/SatelliteBackground';
import { BaseContourLayer2 } from '../layers/BaseContourLayer2';
import { BackgroundImageLayer } from '../layers/BackgroundImageLayer';
import { LocationLayer3 } from '../layers/LocationLayer3';
import { RescueServiceLayer } from '../layers/RescueServiceLayer';

// import { RescueServiceMapPropTypes } from '../../types';

export function RescueServiceMap(props) {
  const {
    curPosition, gameModel, mapConfig, translator,
  } = props;

  return (
    <Map
      curPosition={curPosition}
      gameModel={gameModel}
      mapConfig={mapConfig}
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
      <LocationLayer3
        enableByDefault
      />
      <RescueServiceLayer
        enableByDefault
      />
    </Map>
  );
}

// RescueServiceMap.propTypes = RescueServiceMapPropTypes;
