/* eslint-disable react/jsx-props-no-spreading */
import React, { Component } from 'react';
import './TrackDemoMap.css';

import { Map } from '../../maps/Map';

import { BaseContourLayer2 } from '../../layers/BaseContourLayer2';
import { SatelliteBackground } from '../../layers/SatelliteBackground';
import { ImageBackground } from '../../layers/ImageBackground';

// import { CommonMapPropTypes } from '../../types';

export function TrackDemoMap(props) {
  const {
    curPosition, gameModel, mapConfig, translator, children,
  } = props;

  return (
    <Map
      curPosition={curPosition}
      gameModel={gameModel}
      mapConfig={mapConfig}
      commonPropsExtension={{
        translator,
        gameModel,
      }}
    >
      <SatelliteBackground enableByDefault />
      {/* <ImageBackground /> */}
      <BaseContourLayer2
        enableByDefault
      />
      {children}
    </Map>
  );
}
