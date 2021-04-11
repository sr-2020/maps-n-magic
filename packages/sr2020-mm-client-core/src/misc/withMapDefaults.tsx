import React from 'react';
import { MapDefaultsConsumer } from './mapDefaultsContext';
import { MapDefaults } from "../types";

export interface WithMapDefaults {
  mapDefaults: MapDefaults | null;
}

export const withMapDefaults = (Wrapped: any) => (props: any) => (
  <MapDefaultsConsumer>
    {
      (mapDefaults) => (
        <Wrapped
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...props}
          mapDefaults={mapDefaults}
        />
      )
    }
  </MapDefaultsConsumer>
);
