import React from 'react';
import './AudioEngineDemo.css';

import { DefaultSatelliteBackground } from 'sr2020-mm-client-core/layers/DefaultSatelliteBackground';
import { BaseContourLayer2 } from 'sr2020-mm-client-core/layers/BaseContourLayer2';
import { Map } from 'sr2020-mm-client-core/maps/Map';
import { BackgroundImageDisplayLayer } from '../../layers/BackgroundImageDisplayLayer';
import { ManaOceanLayer } from '../../layers/ManaOceanLayer';

export function AudioEngineDemo(props) {
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
        grayscale
      />
      <BackgroundImageDisplayLayer
        enableByDefault
        imageClassName="grayscale tw-opacity-20"
      />
      <ManaOceanLayer
        enableByDefault
      />
    </Map>
  );
}
