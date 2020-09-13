import React from 'react';
import './ManaOceanMap.css';

import { DefaultSatelliteBackground } from 'sr2020-mm-client-core/layers/DefaultSatelliteBackground';
import { BaseContourLayer2 } from 'sr2020-mm-client-core/layers/BaseContourLayer2';
import { Map } from 'sr2020-mm-client-core/maps/Map';
import { BackgroundImageLayer } from '../../layers/BackgroundImageLayer';
import { LocationLayer3 } from '../../layers/LocationLayer3';
import { ManaOceanLayer } from '../../layers/ManaOceanLayer';
// import { RescueServiceLayer } from '../../layers/RescueServiceLayer';

export function ManaOceanMap(props) {
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
      <DefaultSatelliteBackground enableByDefault={false} />
      <BaseContourLayer2
        enableByDefault
      />
      <BackgroundImageLayer
        enableByDefault
        editable={false}
        imageClassName="grayscale tw-opacity-20"
      />
      <ManaOceanLayer
        enableByDefault
      />
    </Map>
  );
}
