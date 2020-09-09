import React from 'react';
import './BeaconEditorMap.css';

import { Map } from 'sr2020-mm-client-core/maps/Map';

import { DefaultSatelliteBackground } from 'sr2020-mm-client-core/layers/DefaultSatelliteBackground';
import { BaseContourLayer2 } from 'sr2020-mm-client-core/layers/BaseContourLayer2';
import { BackgroundImageLayer } from '../../layers/BackgroundImageLayer';
import { GoogleMapsExportedDataLayer } from '../../layers/GoogleMapsExportedDataLayer';
import { LocationLayer3 } from '../../layers/LocationLayer3';
import { BeaconLayer3 } from '../../layers/BeaconLayer3';

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
      <BackgroundImageLayer
        enableByDefault
        editable={false}
      />
      <GoogleMapsExportedDataLayer
        enableByDefault={false}
      />
      <BeaconLayer3
        enableByDefault
      />
    </Map>
  );
}

// BeaconEditorMap.propTypes = BeaconEditorMapPropTypes;
