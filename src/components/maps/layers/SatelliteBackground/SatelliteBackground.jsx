import React, { Component } from 'react';
import './SatelliteBackground.css';

import L from 'leaflet/dist/leaflet-src';

import { defaultTileLayer } from '../../../../configs/map';

// import { SatelliteBackgroundPropTypes } from '../../types';

export class SatelliteBackground extends Component {
  // static propTypes = SatelliteBackgroundPropTypes;

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const {
      layerCommunicator,
    } = this.props;
    const { urlTemplate, options } = defaultTileLayer;
    layerCommunicator.emit('addToMap', {
      control: L.tileLayer(urlTemplate, options),
    });
    console.log('SatelliteBackground mounted');
  }

  componentDidUpdate() {
    console.log('SatelliteBackground did update');
  }

  componentWillUnmount() {
    console.log('SatelliteBackground will unmount');
  }

  render() {
    return null;
  }
}
