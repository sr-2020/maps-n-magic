import React, {
  Component, useState, useEffect, useContext,
} from 'react';
import Color from 'color';
import './GeoJsonLayer.css';
import * as R from 'ramda';

import L from 'leaflet';
import type { FeatureCollection, Feature } from "geojson";
import { LayerCommunicator } from "../../../index";
import { TranslatorContext } from '../../misc/translatorContext';

// "stroke": "#ffd600",
// "stroke-opacity": 1,
// "stroke-width": 3.001,
// "fill": "#ffd600",
// "fill-opacity": 0.16862745098039217

type GeoJsonStyleProps = 'stroke' | 'stroke-opacity' | 'stroke-width' | 'fill' | 'fill-opacity';

const styleProps = ['stroke', 'stroke-opacity', 'stroke-width', 'fill', 'fill-opacity'];

const transformName = (name: string): string => {
  if (name === 'stroke') return 'color';
  if (name === 'fill') return 'fillColor';
  return camelize(name);
};

function camelize(str: string): string {
  return str;
  // const arr = str.split('-');
  // const capital = arr.map((item, index) => (index ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase() : item));
  // // ^-- change here.
  // const capitalString = capital.join('');
  // return capitalString;
}

interface GeoJsonLayerProps {
  enableByDefault: boolean;
  layerCommunicator: LayerCommunicator;
  layerNameKey: string;
  geoData: FeatureCollection;
  grayscale?: boolean;
}

// eslint-disable-next-line max-lines-per-function
export function GeoJsonLayer(props: GeoJsonLayerProps): null {
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

  const makeStyles = function (properties: Record<string, any>): Record<string, any> {
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
      }, {} as Record<string, any>),
    )(properties);
  };

  useEffect(() => {
    geoData.features.forEach((feature) => {
      feature = translator !== null ? translator.geoJsonMoveTo(feature) : feature;
      const style = function (feature2: Feature) {
        const { properties } = feature2;
        // console.log(properties.name, makeStyles(properties));
        // @ts-ignore
        return makeStyles(properties);
      };
      const geoJsonObj = L.geoJSON(feature, {
        style,
        pmIgnore: true
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
