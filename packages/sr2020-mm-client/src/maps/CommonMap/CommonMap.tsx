/* eslint-disable react/jsx-props-no-spreading */
import React, { Component } from 'react';
import './CommonMap.css';

import { 
  L,
  Map,
  DefaultSatelliteBackground,
  BaseContourLayer2
} from 'sr2020-mm-client-core';
import { GameModel } from "sr2020-mm-event-engine";

// import { BotLayer2 } from '../../oldLayers/BotLayer2';
// import { UserLayer2 } from '../../oldLayers/UserLayer2';
// import { SignalRadiusesLayer2 } from '../../oldLayers/SignalRadiusesLayer2';
// import { VoronoiPolygonsLayer2 } from '../../oldLayers/VoronoiPolygonsLayer2';
// import { MarkerLayer2 } from '../../oldLayers/MarkerLayer2';
// import { LocationLayer2 } from '../../oldLayers/LocationLayer2';
// import { SoundDebug } from '../../oldLayers/SoundDebug';

interface CommonMapProps {
  gameModel: GameModel;
  geomanConfig: L.PM.DrawControlOptions;
}

// eslint-disable-next-line max-lines-per-function
export function CommonMap(props: CommonMapProps) {
  const {
    gameModel, geomanConfig,
  } = props;

  return (
    <Map
      gameModel={gameModel}
      geomanConfig={geomanConfig}
      commonPropsExtension={{
        gameModel,
      }}
    >
      {/* @ts-ignore */}
      <DefaultSatelliteBackground enableByDefault />
      {/* @ts-ignore */}
      <BaseContourLayer2
        enableByDefault
      />
      {/* <MarkerLayer2
        enableByDefault
      />
      <LocationLayer2
        enableByDefault
      />
      <VoronoiPolygonsLayer2 />
      <SignalRadiusesLayer2 />
      <BotLayer2
        enableByDefault
      />
      <UserLayer2
        enableByDefault
      />
      <SoundDebug /> */}
    </Map>
  );
}
