import React from 'react';
import './BackgroundEditorMap.css';

import { 
  Map,
  DefaultSatelliteBackground,
  BaseContourLayer2
} from 'sr2020-mm-client-core';

import { BackgroundImageEditLayer } from '../../layers/BackgroundImageEditLayer';
import { GoogleMapsExportedDataLayer } from '../../layers/GoogleMapsExportedDataLayer';

export function BackgroundEditorMap(props) {
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
      <BackgroundImageEditLayer
        enableByDefault
      />
      <GoogleMapsExportedDataLayer
        enableByDefault={false}
      />
    </Map>
  );
}
