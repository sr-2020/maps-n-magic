import React from 'react';
import * as R from 'ramda';
import './GoogleMapsExportedDataLayer.css';
import { staticGeoData } from 'sr2020-mm-data';
import { GeoJsonLayer, LayerCommunicator } from 'sr2020-mm-client-core';
import { FeatureCollection } from 'geojson';

const featureGroups = R.groupBy((feature) => feature.geometry.type, staticGeoData.features);

const layersGeoData = R.toPairs(R.mapObjIndexed((arr) => ({
  type: 'FeatureCollection',
  features: arr,
} as FeatureCollection), featureGroups));

interface GoogleMapsExportedDataLayerProps {
  enableByDefault: boolean;
  layerCommunicator: LayerCommunicator;
  grayscale?: boolean;
  // layerNameKey: string;
  // geoData: FeatureCollection;
}

export function GoogleMapsExportedDataLayer(props: GoogleMapsExportedDataLayerProps) {
  return (
    <>
      {
        layersGeoData.map(([featureType, geoData]) => (
          <GeoJsonLayer
            {...props}
            layerNameKey={`geoJsonLayer_${featureType}`}
            geoData={geoData}
          />
        ))
      }
    </>
  );
}
