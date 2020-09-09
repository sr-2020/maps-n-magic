import React, { Component } from 'react';
import './BaseContourLayer2.css';

import { contourGeoJson } from 'sr2020-mm-data/assets/baseContours';

import { GeoJsonLayer } from '../GeoJsonLayer';

export function BaseContourLayer2(props) {
  return (
    <GeoJsonLayer
      {...props}
      layerNameKey="baseContourLayer"
      geoData={contourGeoJson}
    />
  );
}
