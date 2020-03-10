import React, { Component } from 'react';
import './GeoJsonLayer.css';

import L from 'leaflet/dist/leaflet-src';

// import { GeoJsonLayerPropTypes } from '../../types';

import staticGeoData from '../../../../dataAnalysis/data/kml/izumrud_socgorod.json';

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

    console.log(staticGeoData);

    staticGeoData.features.forEach((feature) => {
      const geoJsonObj = L.geoJSON(feature, {
        style(feature2) {
          return { color: feature2.properties.color };
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
