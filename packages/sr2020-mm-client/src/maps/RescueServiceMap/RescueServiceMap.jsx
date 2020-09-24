import React from 'react';
import './RescueServiceMap.css';

import { DefaultSatelliteBackground } from 'sr2020-mm-client-core/layers/DefaultSatelliteBackground';
import { BaseContourLayer2 } from 'sr2020-mm-client-core/layers/BaseContourLayer2';
import { Map } from 'sr2020-mm-client-core/maps/Map';
import { BackgroundImageDisplayLayer } from '../../layers/BackgroundImageDisplayLayer';
import { LocationLayer3 } from '../../layers/LocationLayer3';
import { RescueServiceLayer } from '../../layers/RescueServiceLayer';

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
      <BackgroundImageDisplayLayer
        enableByDefault
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
