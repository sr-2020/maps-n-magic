import React, { Component } from 'react';
import './BaseContourLayer2.css';

import { contourGeoJson } from 'sr2020-mm-data';

import { GeoJsonLayer } from '../GeoJsonLayer';

import { LayerCommunicator } from "../../../index";

interface BaseContourLayer2 {
  enableByDefault: boolean;
  layerCommunicator: LayerCommunicator;
  grayscale?: boolean;
}

export function BaseContourLayer2(props: BaseContourLayer2) {
  return (
    <GeoJsonLayer
      {...props}
      layerNameKey="baseContourLayer"
      geoData={contourGeoJson}
    />
  );
}
