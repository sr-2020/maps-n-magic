import React from 'react';
import './BackgroundEditorMap.css';

import { 
  L,
  Map,
  DefaultSatelliteBackground,
  BaseContourLayer2
} from 'sr2020-mm-client-core';
import { GameModel } from "sr2020-mm-event-engine";

import { BackgroundImageEditLayer } from '../../layers/BackgroundImageEditLayer';
import { GoogleMapsExportedDataLayer } from '../../layers/GoogleMapsExportedDataLayer';

interface BackgroundEditorMapProps {
  gameModel: GameModel;
  geomanConfig: L.PM.DrawControlOptions;
}

export function BackgroundEditorMap(props: BackgroundEditorMapProps) {
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
      <BackgroundImageEditLayer
        enableByDefault
      />
      {/* @ts-ignore */}
      <GoogleMapsExportedDataLayer
        enableByDefault={false}
      />
    </Map>
  );
}
