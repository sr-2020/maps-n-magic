import React from 'react';
import './RescueServiceMap.css';

import { 
  L,
  Map,
  DefaultSatelliteBackground,
  BaseContourLayer2
} from 'sr2020-mm-client-core';
import { GameModel } from "sr2020-mm-event-engine";

import { BackgroundImageDisplayLayer } from '../../layers/BackgroundImageDisplayLayer';
import { LocationLayer4 } from '../../layers/LocationLayer4';
import { RescueServiceLayer2 } from '../../layers/RescueServiceLayer2';
import { RescueServiceTable } from '../../components/RescueServiceTable';
import { RescueServiceSoundAlarm } from '../../components/RescueServiceSoundAlarm';

interface RescueServiceMapProps {
  gameModel: GameModel;
}

export function RescueServiceMap(props: RescueServiceMapProps) {
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
      {/* @ts-ignore */}
      <DefaultSatelliteBackground enableByDefault />
      {/* @ts-ignore */}
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
      {/* @ts-ignore */}
      <RescueServiceLayer2 enableByDefault/>
      {/* @ts-ignore */}
      <RescueServiceTable />
      {/* @ts-ignore */}
      <RescueServiceSoundAlarm />
    </Map>
  );
}
