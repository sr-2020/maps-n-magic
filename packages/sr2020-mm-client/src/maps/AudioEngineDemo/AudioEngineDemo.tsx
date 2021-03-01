import React from 'react';
import './AudioEngineDemo.css';

import { 
  DefaultSatelliteBackground,
  BaseContourLayer2,
  Map
} from 'sr2020-mm-client-core';
import { BackgroundImageDisplayLayer } from '../../layers/BackgroundImageDisplayLayer';
import { ManaOceanLayer } from '../../layers/ManaOceanLayer';
import { CharacterLocationLayer } from '../../layers/CharacterLocationLayer';

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
      <CharacterLocationLayer
        enableByDefault
      />
    </Map>
  );
}
