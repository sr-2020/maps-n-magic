import React, { Component, useState, useEffect } from 'react';
import './GeoJsonLayer.css';
import * as R from 'ramda';

import L from 'leaflet/dist/leaflet-src';

// "stroke": "#ffd600",
// "stroke-opacity": 1,
// "stroke-width": 3.001,
// "fill": "#ffd600",
// "fill-opacity": 0.16862745098039217

const styleProps = ['stroke', 'stroke-opacity', 'stroke-width', 'fill', 'fill-opacity'];

const transformName = (name) => {
  if (name === 'stroke') return 'color';
  if (name === 'fill') return 'fillColor';
  return camelize(name);
};

function camelize(str) {
  return str;
  // const arr = str.split('-');
  // const capital = arr.map((item, index) => (index ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase() : item));
  // // ^-- change here.
  // const capitalString = capital.join('');
  // return capitalString;
}

export function GeoJsonLayer(props) {
  const [group] = useState(L.layerGroup([]));
  const {
    enableByDefault, layerCommunicator, layerNameKey, geoData, translator,
  } = props;

  useEffect(() => {
    layerCommunicator.emit('setLayersMeta', {
      layersMeta: {
        [layerNameKey]: group,
      },
      enableByDefault,
    });

    geoData.features.forEach((feature) => {
      const style = function (feature2) {
        const { properties } = feature2;
        const makeStyles = R.pipe(
          R.keys,
          R.filter(R.includes(R.__, styleProps)),
          R.reduce((acc, prop) => {
            acc[transformName(prop)] = properties[prop];
            return acc;
          }, {}),
        );
        // console.log(properties.name, makeStyles(properties));
        return makeStyles(properties);
      };
      const geoJsonObj = L.geoJSON(feature, {
        style,
      })
        .bindPopup((layer) => layer.feature.properties.description || '')
        .bindTooltip((layer) => layer.feature.properties.name || '');
      group.addLayer(geoJsonObj);
    });

    return () => {
      group.clearLayers();
    };
  }, []);

  return null;
}
