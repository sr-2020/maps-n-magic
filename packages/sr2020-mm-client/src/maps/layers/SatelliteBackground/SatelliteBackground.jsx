import React, { Component } from 'react';
import './SatelliteBackground.css';

import L from 'leaflet/dist/leaflet-src';

import { defaultTileLayer } from '../../../configs/map';

// import { SatelliteBackgroundPropTypes } from '../../types';

export class SatelliteBackground extends Component {
  // static propTypes = SatelliteBackgroundPropTypes;
  group = L.layerGroup([]);

  nameKey = 'satelliteLayer';

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
    console.log('SatelliteBackground mounted');
  }

  componentDidUpdate(prevProps) {
    console.log('SatelliteBackground did update');
  }

  getLayersMeta() {
    return {
      [this.nameKey]: this.group,
    };
  }

  componentWillUnmount() {
    this.clear();
    console.log('SatelliteBackground will unmount');
  }

  populate() {
    const { urlTemplate, options } = defaultTileLayer;
    this.group.addLayer(L.tileLayer(urlTemplate, options));
  }

  clear() {
    this.group.clearLayers();
  }

  render() {
    return null;
  }
}
