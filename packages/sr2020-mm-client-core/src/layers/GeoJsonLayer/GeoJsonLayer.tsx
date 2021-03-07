import React, {
  Component, useState, useEffect, useContext,
} from 'react';
import Color from 'color';
import './GeoJsonLayer.css';
import * as R from 'ramda';

import L from 'leaflet';
import { TranslatorContext } from '../../misc/translatorContext';

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

// eslint-disable-next-line max-lines-per-function
export function GeoJsonLayer(props) {
  const [group] = useState(L.layerGroup([]));
  const {
    enableByDefault, layerCommunicator, layerNameKey, geoData, grayscale = false,
  } = props;
  const translator = useContext(TranslatorContext);

  useEffect(() => {
    layerCommunicator.emit('setLayersMeta', {
      layersMeta: {
        [layerNameKey]: group,
      },
      enableByDefault,
    });

    return () => {
      group.clearLayers();
    };
  }, []);

  const makeStyles = function (properties) {
    return R.pipe(
      R.keys,
      R.filter(R.includes(R.__, styleProps)),
      R.reduce((acc, prop) => {
        let value = properties[prop];
        if (grayscale && (prop === 'stroke' || prop === 'fill')) {
          value = Color(value).grayscale().string();
        }
        acc[transformName(prop)] = value;
        return acc;
      }, {}),
    )(properties);
  };

  useEffect(() => {
    geoData.features.forEach((feature) => {
      feature = translator.geoJsonMoveTo(feature);
      const style = function (feature2) {
        const { properties } = feature2;
        // console.log(properties.name, makeStyles(properties));
        return makeStyles(properties);
      };
      const geoJsonObj = L.geoJSON(feature, {
        style,
      })
        // @ts-ignore
        .bindPopup((layer: L.GeoJSON) => layer.feature.properties.description || '')
        // @ts-ignore
        .bindTooltip((layer: L.GeoJSON) => layer.feature.properties.name || '');
      group.addLayer(geoJsonObj);
    });

    return () => {
      group.clearLayers();
    };
  }, [translator]);

  return null;
}
