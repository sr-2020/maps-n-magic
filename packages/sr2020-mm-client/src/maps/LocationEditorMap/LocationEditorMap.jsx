import React from 'react';
import './LocationEditorMap.css';

import { Map } from '../Map';

import { DefaultSatelliteBackground } from '../../layers/DefaultSatelliteBackground';
import { BaseContourLayer2 } from '../../layers/BaseContourLayer2';
import { BackgroundImageLayer } from '../../layers/BackgroundImageLayer';
import { GoogleMapsExportedDataLayer } from '../../layers/GoogleMapsExportedDataLayer';
import { LocationLayer3 } from '../../layers/LocationLayer3';

// import { LocationEditorMapPropTypes } from '../../types';

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
      <BackgroundImageLayer
        enableByDefault
        editable={false}
      />
      <GoogleMapsExportedDataLayer
        enableByDefault={false}
      />
      <LocationLayer3
        enableByDefault
      />
    </Map>
  );
}

// LocationEditorMap.propTypes = LocationEditorMapPropTypes;
