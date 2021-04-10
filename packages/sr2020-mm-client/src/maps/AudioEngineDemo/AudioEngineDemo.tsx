import React from 'react';
import './AudioEngineDemo.css';

import { GameModel } from "sr2020-mm-event-engine";
import { 
  DefaultSatelliteBackground,
  BaseContourLayer2,
  Map
} from 'sr2020-mm-client-core';
import { BackgroundImageDisplayLayer } from '../../layers/BackgroundImageDisplayLayer';
import { ManaOceanLayer } from '../../layers/ManaOceanLayer';
import { CharacterLocationLayer } from '../../layers/CharacterLocationLayer';

interface AudioEngineDemoProps {
  gameModel: GameModel;
}

export function AudioEngineDemo(props: AudioEngineDemoProps) {
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
      {/* @ts-ignore */}
      <DefaultSatelliteBackground enableByDefault={false} />
      {/* @ts-ignore */}
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
