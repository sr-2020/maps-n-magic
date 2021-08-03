import React from 'react';
import './BeaconEditorMap.css';

import { 
  L,
  Map,
  DefaultSatelliteBackground,
  BaseContourLayer2
} from 'sr2020-mm-client-core';
import { GameModel } from "sr2020-mm-event-engine";

import { BackgroundImageDisplayLayer } from '../../layers/BackgroundImageDisplayLayer';
import { GoogleMapsExportedDataLayer } from '../../layers/GoogleMapsExportedDataLayer';
import { BeaconLayer4 } from '../../layers/BeaconLayer4';
import { LocationLayer4 } from '../../layers/LocationLayer4';
import { BeaconBindingsLayer } from '../../layers/BeaconBindingsLayer';
import { LocateControlLayer } from '../../layers/LocateControlLayer';

interface BeaconEditorMapProps {
  gameModel: GameModel;
  geomanConfig: L.PM.DrawControlOptions;
}

export function BeaconEditorMap(props: BeaconEditorMapProps) {
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
      <BackgroundImageDisplayLayer
        enableByDefault
      />
      {/* @ts-ignore */}
      <GoogleMapsExportedDataLayer
        enableByDefault={false}
      />
      <LocationLayer4
        editable={false}
        enableByDefault={false}
        enableLayerIndex={{
          geoLocation: true,
        }}
      />
      <BeaconLayer4
        enableByDefault
      />
      <BeaconBindingsLayer
        enableByDefault
      />
      {/* @ts-ignore */}
      <LocateControlLayer />
    </Map>
  );
}
