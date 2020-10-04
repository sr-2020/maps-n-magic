import React, { Component } from 'react';
import L from 'leaflet/dist/leaflet-src';
import * as R from 'ramda';

import { getArrDiff } from 'sr2020-mm-event-engine/utils';

import { layerIdToLayerName, locationTypes, locationTypeSequence } from './LocationLayerTypes';

import { LocationGroupLayer } from './LocationGroupLayer.jsx';

const isNotEmptyPolygon = R.pipe(
  R.prop('polygon'),
  R.equals({}),
  R.not,
);

const defaultGroups = R.keys(layerIdToLayerName).reduce((acc, layerId) => {
  acc[layerId] = [];
  return acc;
}, {});

export function InnerLocationLayer(props) {
  const { locationRecords } = props;

  const locationGroups = R.groupBy(R.prop('layer_id'), locationRecords.filter(isNotEmptyPolygon));

  const mergedGroups = { ...defaultGroups, ...locationGroups };
  return (
    <>
      {
        locationTypeSequence.map((layerId) => (
          <LocationGroupLayer
            {...props}
            layerId={layerId}
            geoLayerName={layerIdToLayerName[layerId]}
            nameKey={`locationsLayer_${layerIdToLayerName[layerId]}`}
            locationRecords={mergedGroups[layerId]}
          />
        ))
      }
    </>
  );
}
