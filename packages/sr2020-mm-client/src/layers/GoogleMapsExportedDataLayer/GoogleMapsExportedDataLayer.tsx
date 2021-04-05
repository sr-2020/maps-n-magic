import React from 'react';
import * as R from 'ramda';
import './GoogleMapsExportedDataLayer.css';
import { staticGeoData } from 'sr2020-mm-data';
import { GeoJsonLayer } from 'sr2020-mm-client-core';

const featureGroups = R.groupBy((feature) => feature.geometry.type, staticGeoData.features);

const layersGeoData = R.toPairs(R.mapObjIndexed((arr) => ({
  type: 'FeatureCollection',
  features: arr,
}), featureGroups));

export function GoogleMapsExportedDataLayer(props) {
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
