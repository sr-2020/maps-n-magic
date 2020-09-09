/* eslint-disable react/jsx-props-no-spreading */
import React, { Component } from 'react';
import './TrackDemoMap.css';

import { BaseContourLayer2 } from 'sr2020-mm-client-core/layers/BaseContourLayer2';
import { DefaultSatelliteBackground } from 'sr2020-mm-client-core/layers/DefaultSatelliteBackground';
import { Map } from 'sr2020-mm-client-core/maps/Map';

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
