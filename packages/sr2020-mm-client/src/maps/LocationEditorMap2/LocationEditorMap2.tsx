import React from 'react';
import './LocationEditorMap2.css';

import { 
  L,
  Map,
  DefaultSatelliteBackground,
  BaseContourLayer2
} from 'sr2020-mm-client-core';
import { GameModel } from "sr2020-mm-event-engine";

import { BackgroundImageDisplayLayer } from '../../layers/BackgroundImageDisplayLayer';
import { GoogleMapsExportedDataLayer } from '../../layers/GoogleMapsExportedDataLayer';
import { LocationLayer4 } from '../../layers/LocationLayer4';
import { LocationCentroidLayer } from '../../layers/LocationCentroidLayer';
import { LocationNeighborLayer } from '../../layers/LocationNeighborLayer';

interface LocationEditorMap2Props {
  gameModel: GameModel;
  geomanConfig: L.PM.DrawControlOptions;
}

export function LocationEditorMap2(props: LocationEditorMap2Props) {
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
      />
      <LocationLayer4
        editable
        enableByDefault
      />
      <LocationNeighborLayer enableByDefault={false} />
      <LocationCentroidLayer enableByDefault={false} />
    </Map>
  );
}
