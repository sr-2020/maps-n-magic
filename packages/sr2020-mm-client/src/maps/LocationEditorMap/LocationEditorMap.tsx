import React from 'react';
import './LocationEditorMap.css';

import { 
  Map,
  DefaultSatelliteBackground,
  BaseContourLayer2
} from 'sr2020-mm-client-core';

import { BackgroundImageDisplayLayer } from '../../layers/BackgroundImageDisplayLayer';
import { GoogleMapsExportedDataLayer } from '../../layers/GoogleMapsExportedDataLayer';
import { LocationLayer4 } from '../../layers/LocationLayer4';
import { LocationCentroidLayer } from '../../layers/LocationCentroidLayer';
import { LocationNeighborLayer } from '../../layers/LocationNeighborLayer';

export function LocationEditorMap(props) {
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
      <DefaultSatelliteBackground enableByDefault />
      <BaseContourLayer2
        enableByDefault
      />
      <BackgroundImageDisplayLayer
        enableByDefault
      />
      <GoogleMapsExportedDataLayer
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
