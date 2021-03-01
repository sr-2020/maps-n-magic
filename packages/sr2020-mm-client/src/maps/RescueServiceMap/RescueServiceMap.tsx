import React from 'react';
import './RescueServiceMap.css';

import { 
  Map,
  DefaultSatelliteBackground,
  BaseContourLayer2
} from 'sr2020-mm-client-core';

import { BackgroundImageDisplayLayer } from '../../layers/BackgroundImageDisplayLayer';
import { LocationLayer4 } from '../../layers/LocationLayer4';
import { RescueServiceLayer2 } from '../../layers/RescueServiceLayer2';
import { RescueServiceTable } from '../../components/RescueServiceTable';
import { RescueServiceSoundAlarm } from '../../components/RescueServiceSoundAlarm';

export function RescueServiceMap(props) {
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
      <DefaultSatelliteBackground enableByDefault />
      <BaseContourLayer2
        enableByDefault
      />
      <BackgroundImageDisplayLayer
        enableByDefault
      />
      <LocationLayer4
        editable={false}
        enableByDefault={false}
        enableLayerIndex={{
          geoLocation: true,
        }}
      />
      <RescueServiceLayer2
        enableByDefault
      />
      <RescueServiceTable />
      <RescueServiceSoundAlarm />
    </Map>
  );
}
