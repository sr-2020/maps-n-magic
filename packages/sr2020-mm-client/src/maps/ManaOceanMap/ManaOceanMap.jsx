import React from 'react';
import './ManaOceanMap.css';

import { DefaultSatelliteBackground } from 'sr2020-mm-client-core/layers/DefaultSatelliteBackground';
import { BaseContourLayer2 } from 'sr2020-mm-client-core/layers/BaseContourLayer2';
import { Map } from 'sr2020-mm-client-core/maps/Map';
import { BackgroundImageDisplayLayer } from '../../layers/BackgroundImageDisplayLayer';
import { ManaOceanLayer } from '../../layers/ManaOceanLayer';
import { LocationCentroidLayer } from '../../layers/LocationCentroidLayer';
import { LocationNeighborLayer } from '../../layers/LocationNeighborLayer';

export function ManaOceanMap(props) {
  const {
    gameModel,
  } = props;

  return (
    <Map
      gameModel={gameModel}
      commonPropsExtension={{
        gameModel,
      }}
    >
      <DefaultSatelliteBackground enableByDefault={false} />
      <BaseContourLayer2
        enableByDefault
        grayscale
      />
      <BackgroundImageDisplayLayer
        enableByDefault
        imageClassName="grayscale tw-opacity-20"
      />
      <ManaOceanLayer
        enableByDefault
      />
      <LocationNeighborLayer enableByDefault={false} />
      <LocationCentroidLayer enableByDefault={false} />
    </Map>
  );
}
