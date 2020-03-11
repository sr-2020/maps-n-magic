import React, { Component } from 'react';
import './GeoJsonLayer.css';
import * as R from 'ramda';

import L from 'leaflet/dist/leaflet-src';

// import { GeoJsonLayerPropTypes } from '../../types';

// import staticGeoData from '../../../../dataAnalysis/data/kml/izumrud_socgorod.json';
import staticGeoData from '../../../../dataAnalysis/data/kml/aggregatedKml.json';

console.log(staticGeoData);

const types = R.pipe(
  R.map(R.path(['geometry', 'type'])),
  R.uniq,
)(staticGeoData.features);
console.log('types', types);

types.forEach((type) => {
  const propList = staticGeoData.features.filter((feature) => feature.geometry.type === type).reduce((acc, feature) => {
    acc = R.uniq(R.concat(acc, R.keys(feature.properties)));
    return acc;
  }, []);
  console.log(`${type} props`, propList);
});

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

export class GeoJsonLayer extends Component {
  // static propTypes = GeoJsonLayerPropTypes;
  group = L.layerGroup([]);

  nameKey = 'geoJsonLayer';

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const {
      enableByDefault, layerCommunicator,
    } = this.props;
    layerCommunicator.emit('setLayersMeta', {
      layersMeta: this.getLayersMeta(),
      enableByDefault,
    });
    this.populate();
    console.log('GeoJsonLayer mounted');
  }

  componentDidUpdate(prevProps) {
    const { translator } = this.props;
    if (prevProps.translator !== translator) {
      this.clear();
      this.populate();
    }
    console.log('GeoJsonLayer did update');
  }

  componentWillUnmount() {
    this.clear();
    console.log('GeoJsonLayer will unmount');
  }

  getLayersMeta() {
    return {
      [this.nameKey]: this.group,
    };
  }

  populate() {
    const { translator } = this.props;

    staticGeoData.features.forEach((feature) => {
      const geoJsonObj = L.geoJSON(feature, {
        style(feature2) {
          const { properties } = feature2;
          const makeStyles = R.pipe(
            R.keys,
            R.filter(R.includes(R.__, styleProps)),
            R.reduce((acc, prop) => {
              acc[transformName(prop)] = properties[prop];
              return acc;
            }, {}),
          );
          console.log(properties.name, makeStyles(properties));
          return makeStyles(properties);
          // feature2.properties;
          // return { color: feature2.properties.color };
        },
      })
        .bindPopup((layer) => layer.feature.properties.description || '')
        .bindTooltip((layer) => layer.feature.properties.name || '');
      this.group.addLayer(geoJsonObj);
    });
  }

  clear() {
    this.group.clearLayers();
  }

  render() {
    return null;
  }
}
