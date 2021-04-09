import React, { Component } from 'react';
import { L } from "sr2020-mm-client-core";
import * as R from 'ramda';


import { getArrDiff, LocationRecord } from 'sr2020-mm-event-engine';

import { 
  layerIdToLayerName, 
  locationTypeSequence, 
  locationTypesEnum,
} from './LocationLayerTypes';

import { LocationGroupLayer } from './LocationGroupLayer';

import { WithLocationRecords } from '../../dataHOCs';

const isNotEmptyPolygon = R.pipe(
  R.prop('polygon'),
  R.equals({}),
  R.not,
);

const defaultGroups = Object.keys(locationTypesEnum).reduce((acc, layerId: locationTypesEnum) => {
  acc[layerId] = [];
  return acc;
}, {} as Record<keyof typeof locationTypesEnum, LocationRecord[]>);

interface InnerLocationLayerProps extends WithLocationRecords {

}

export function InnerLocationLayer(props: InnerLocationLayerProps) {
  const { locationRecords } = props;

  const locationGroups = R.groupBy(lr => {
    return layerIdToLayerName[lr.layer_id];
  }, locationRecords.filter(isNotEmptyPolygon)) as Record<keyof typeof locationTypesEnum, LocationRecord[]>;

  const mergedGroups = { ...defaultGroups, ...locationGroups };
  return (
    <>
      {
        locationTypeSequence.map((layerId) => (
          <LocationGroupLayer
            {...props}
            // layerId={layerId}
            geoLayerName={layerIdToLayerName[layerId]}
            nameKey={`locationsLayer_${layerIdToLayerName[layerId]}`}
            locationRecords={mergedGroups[layerId]}
          />
        ))
      }
    </>
  );
}
