import React from 'react';
import './BeaconEditorMap.css';

import { Map } from '../Map';

import { DefaultSatelliteBackground } from '../../layers/DefaultSatelliteBackground';
import { BaseContourLayer2 } from '../../layers/BaseContourLayer2';
import { BackgroundImageLayer } from '../../layers/BackgroundImageLayer';
import { GeoJsonLayer } from '../../layers/GeoJsonLayer';
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
      <GeoJsonLayer
        enableByDefault={false}
      />
      <BeaconLayer3
        enableByDefault
      />
    </Map>
  );
}

// BeaconEditorMap.propTypes = BeaconEditorMapPropTypes;
