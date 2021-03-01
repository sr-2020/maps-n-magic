import React from 'react';
import { MapDefaultsConsumer } from './mapDefaultsContext';

export const withMapDefaults = (Wrapped) => (props) => (
  <MapDefaultsConsumer>
    {
      (mapDefaults) => (
        <Wrapped
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...props}
          defaultZoom={mapDefaults.defaultZoom}
          defaultCenter={mapDefaults.defaultCenter}
          mapDefaults={mapDefaults}
        />
      )
    }
  </MapDefaultsConsumer>
);
