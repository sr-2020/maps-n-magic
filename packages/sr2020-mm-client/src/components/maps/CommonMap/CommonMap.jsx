/* eslint-disable react/jsx-props-no-spreading */
import React, { Component } from 'react';
import './CommonMap.css';

import { Map2 } from '../Map2';

import { BotLayer2 } from '../layers/BotLayer2';
import { UserLayer2 } from '../layers/UserLayer2';
import { SignalRadiusesLayer2 } from '../layers/SignalRadiusesLayer2';
import { VoronoiPolygonsLayer2 } from '../layers/VoronoiPolygonsLayer2';
import { BaseContourLayer2 } from '../layers/BaseContourLayer2';
import { MarkerLayer2 } from '../layers/MarkerLayer2';
import { LocationLayer2 } from '../layers/LocationLayer2';
import { SoundDebug } from '../layers/SoundDebug';
import { SatelliteBackground } from '../layers/SatelliteBackground';
import { ImageBackground } from '../layers/ImageBackground';
import { RealTrackDemo } from '../layers/RealTrackDemo';

// import { CommonMapPropTypes } from '../../types';

// eslint-disable-next-line max-lines-per-function
export function CommonMap(props) {
  const {
    curPosition, gameModel, mapConfig, translator, geomanConfig,
  } = props;

  return (
    <Map2
      curPosition={curPosition}
      gameModel={gameModel}
      mapConfig={mapConfig}
      geomanConfig={geomanConfig}
      commonPropsExtension={{
        translator,
        gameModel,
      }}
    >
      <SatelliteBackground enableByDefault />
      {/* <ImageBackground  /> */}
      <BaseContourLayer2
        enableByDefault
      />
      <MarkerLayer2
        enableByDefault
      />
      <LocationLayer2
        enableByDefault
      />
      <VoronoiPolygonsLayer2 />
      <SignalRadiusesLayer2 />
      <BotLayer2
        enableByDefault
      />
      <UserLayer2
        enableByDefault
      />
      <SoundDebug />
    </Map2>
  );
}
