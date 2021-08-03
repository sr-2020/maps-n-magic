import React, { Component } from 'react';
import { L } from "sr2020-mm-client-core";
import * as R from 'ramda';


import { getArrDiff, LocationRecord, isNotEmptyPolygon } from 'sr2020-mm-event-engine';

import { 
  layerIdToLayerName, 
  locationTypeSequence, 
  locationTypesEnum,
  locationTypeToLayerTkey
} from './LocationLayerTypes';

import { LocationGroupLayer, LocationGroupLayerProps } from './LocationGroupLayer';

import { WithLocationRecords } from '../../dataHOCs';

const defaultGroups = Object.keys(locationTypesEnum).reduce((acc, layerId: locationTypesEnum) => {
  acc[layerId] = [];
  return acc;
}, {} as Record<keyof typeof locationTypesEnum, LocationRecord[]>);

// type SubProps = Pick<LocationGroupLayerProps, 'geoLayerName'>;

export interface InnerLocationLayerProps extends WithLocationRecords, LocationGroupLayerProps {
  editable: boolean;
}

export function InnerLocationLayer(props: InnerLocationLayerProps) {
  const { locationRecords, editable } = props;

  const locationGroups = R.groupBy(lr => {
    return layerIdToLayerName[lr.layer_id];
  }, locationRecords.filter(isNotEmptyPolygon)) as Record<keyof typeof locationTypesEnum, LocationRecord[]>;

  const mergedGroups = { ...defaultGroups, ...locationGroups };

  const suffix: "_editable" | "_static" = editable === true ? '_editable' : '_static';
  return (
    <>
      {
        locationTypeSequence.map((locationType) => (
          <LocationGroupLayer
            {...props}
            geoLayerName={locationType.name}
            // @ts-ignore
            nameKey={locationTypeToLayerTkey(locationType.name) + suffix}
            locationRecords={mergedGroups[locationType.name]}
          />
        ))
      }
    </>
  );
}
