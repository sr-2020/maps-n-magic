import React from 'react';
import './ManaOceanMap.css';

import { 
  L,
  Map,
  DefaultSatelliteBackground,
  BaseContourLayer2
} from 'sr2020-mm-client-core';
import { GameModel } from "sr2020-mm-event-engine";

import { BackgroundImageDisplayLayer } from '../../layers/BackgroundImageDisplayLayer';
import { ManaOceanLayer } from '../../layers/ManaOceanLayer';
import { LocationCentroidLayer } from '../../layers/LocationCentroidLayer';
import { LocationNeighborLayer } from '../../layers/LocationNeighborLayer';

interface ManaOceanMapProps {
  gameModel: GameModel;
}

export function ManaOceanMap(props: ManaOceanMapProps) {
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
      <LocationNeighborLayer enableByDefault={false} />
      <LocationCentroidLayer enableByDefault={false} />
    </Map>
  );
}
