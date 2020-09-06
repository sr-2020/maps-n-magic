/* eslint-disable react/jsx-props-no-spreading */
import React, { Component } from 'react';
import './TrackDemoMap.css';

import { Map2 } from '../../components/maps/Map2';

import { BaseContourLayer2 } from '../../components/maps/layers/BaseContourLayer2';
import { SatelliteBackground } from '../../components/maps/layers/SatelliteBackground';
import { ImageBackground } from '../../components/maps/layers/ImageBackground';

// import { CommonMapPropTypes } from '../../types';

export function TrackDemoMap(props) {
  const {
    curPosition, gameModel, mapConfig, translator, children,
  } = props;

  return (
    <Map2
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
    </Map2>
  );
}
