import React from 'react';
import './BeaconEditorMap.css';

import { Map } from 'sr2020-mm-client-core/maps/Map';

import { DefaultSatelliteBackground } from 'sr2020-mm-client-core/layers/DefaultSatelliteBackground';
import { BaseContourLayer2 } from 'sr2020-mm-client-core/layers/BaseContourLayer2';
import { BackgroundImageDisplayLayer } from '../../layers/BackgroundImageDisplayLayer';
import { GoogleMapsExportedDataLayer } from '../../layers/GoogleMapsExportedDataLayer';
import { BeaconLayer4 } from '../../layers/BeaconLayer4';

// import { BeaconEditorMapPropTypes } from '../../types';

export function BeaconEditorMap(props) {
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
      <BeaconLayer4
        enableByDefault
      />
    </Map>
  );
}

// BeaconEditorMap.propTypes = BeaconEditorMapPropTypes;
