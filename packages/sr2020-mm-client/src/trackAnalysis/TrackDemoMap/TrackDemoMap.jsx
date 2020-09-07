/* eslint-disable react/jsx-props-no-spreading */
import React, { Component } from 'react';
import './TrackDemoMap.css';

import { Map } from '../../maps/Map';

import { BaseContourLayer2 } from '../../layers/BaseContourLayer2';
import { DefaultSatelliteBackground } from '../../layers/DefaultSatelliteBackground';

// import { CommonMapPropTypes } from '../../types';

export function TrackDemoMap(props) {
  const {
    children,
  } = props;

  return (
    <Map
      commonPropsExtension={{
      }}
    >
      <DefaultSatelliteBackground enableByDefault />
      <BaseContourLayer2
        enableByDefault
      />
      {children}
    </Map>
  );
}
