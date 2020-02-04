/* eslint-disable react/jsx-props-no-spreading */
import React, { Component } from 'react';
import './TrackDemoMap.css';

import { Map2 } from '../Map2';

import { BaseContourLayer2 } from '../layers/BaseContourLayer2';
import { SatelliteBackground } from '../layers/SatelliteBackground';
import { ImageBackground } from '../layers/ImageBackground';
import { RealTrackDemo } from '../layers/RealTrackDemo';

// import { CommonMapPropTypes } from '../../types';

export function TrackDemoMap(props) {
  const {
    curPosition, gameModel, mapConfig, translator,
  } = props;

  return (
    <Map2
      curPosition={curPosition}
      gameModel={gameModel}
      mapConfig={mapConfig}
      render={(mapProps) => {
        const commonProps = {
          ...mapProps,
          translator,
          gameModel,
        };
        return (
          <>
            <SatelliteBackground {...commonProps} />
            {/* <ImageBackground {...commonProps} /> */}
            <BaseContourLayer2
              enableByDefault
              {...commonProps}
            />
            <RealTrackDemo
              enableByDefault
              {...commonProps}
            />
          </>
        );
      }}
    />
  );
}
