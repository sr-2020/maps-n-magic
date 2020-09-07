import React from 'react';
import './RescueServiceMap.css';

import { Map } from '../Map';

import { DefaultSatelliteBackground } from '../../layers/DefaultSatelliteBackground';
import { BaseContourLayer2 } from '../../layers/BaseContourLayer2';
import { BackgroundImageLayer } from '../../layers/BackgroundImageLayer';
import { LocationLayer3 } from '../../layers/LocationLayer3';
import { RescueServiceLayer } from '../../layers/RescueServiceLayer';

// import { RescueServiceMapPropTypes } from '../../types';

export function RescueServiceMap(props) {
  const {
    gameModel,
  } = props;

  return (
    <Map
      gameModel={gameModel}
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
