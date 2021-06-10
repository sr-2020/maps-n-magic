import React from 'react';
import './SpiritMap.css';

import { 
  L,
  Map,
  DefaultSatelliteBackground,
  BaseContourLayer2
} from 'sr2020-mm-client-core';
import { GameModel } from "sr2020-mm-event-engine";

import { BackgroundImageDisplayLayer } from '../../layers/BackgroundImageDisplayLayer';
import { LocationLayer4 } from '../../layers/LocationLayer4';
import { SpiritLayer } from '../../layers/SpiritLayer';

interface SpiritMapProps {
  gameModel: GameModel;
}

export function SpiritMap(props: SpiritMapProps) {
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
      
      <LocationLayer4
        editable={false}
        enableByDefault={false}
        enableLayerIndex={{
          geoLocation: true,
        }}
      />
      <SpiritLayer
        enableByDefault
      />
    </Map>
  );
}
