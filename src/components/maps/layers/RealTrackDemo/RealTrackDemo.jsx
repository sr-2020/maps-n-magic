import React, { Component } from 'react';
import './RealTrackDemo.css';


import L from 'leaflet/dist/leaflet-src';
import * as R from 'ramda';

import trackData from '../../../../dataAnalysis/playerTracks2.json';

import { COLOR_PALETTE } from '../../../../utils/colorPalette';

// import { RealTrackDemoPropTypes } from '../../types';

export class RealTrackDemo extends Component {
  beaconGroup = L.layerGroup([]);

  beaconNameKey = 'beaconGroup';

  // static propTypes = RealTrackDemoPropTypes;

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const {
      enableByDefault, layerCommunicator,
    } = this.props;
    // this.subscribe('on', gameModel);
    this.populate();
    layerCommunicator.emit('setLayersMeta', {
      layersMeta: this.getLayersMeta(),
      enableByDefault: false,
    });
    console.log('RealTrackDemo mounted');
  }

  componentDidUpdate() {
    console.log('RealTrackDemo did update');
  }

  componentWillUnmount() {
    this.clear();
    console.log('RealTrackDemo will unmount');
  }

  getLayersMeta() {
    return {
      [this.beaconNameKey]: this.beaconGroup,
      ...this.tracks,
    };
  }

  populate() {
    // const {
    //   gameModel, translator,
    // } = this.props;

    R.values(trackData.beaconIndex).forEach((beacon) => {
      // L.Marker();
      const marker = L.marker({
        lat: beacon.lat,
        lng: beacon.lng,
      }, { id: beacon.id });
      marker.on('mouseover', function (e) {
        marker.bindPopup(`${beacon.id}`);
        this.openPopup();
      });
      marker.on('mouseout', function (e) {
        this.closeTooltip();
      });
      this.beaconGroup.addLayer(marker);
    });

    let index = 0;
    const addNoise = ([lat, lng]) => [lat + (Math.random() - 0.5) / 20000, lng + (Math.random() - 0.5) / 20000];
    this.tracks = R.toPairs(trackData.userTracks).map(([userName, userTrack]) => {
      const group = L.layerGroup([]);
      const track = L.polyline(userTrack.map(R.prop('latlng')).map(addNoise), {
        id: userName,
        color: COLOR_PALETTE[index % COLOR_PALETTE.length].color.background,
      });
      group.addLayer(track);
      index++;
      return [`id ${userName} (${userTrack.length} points)`, group];
    });
    this.tracks = R.fromPairs(this.tracks);
  }

  clear() {
    this.beaconGroup.clearLayers();
    R.values(this.tracks).forEach((track) => track.clearLayers());
  }

  render() {
    return null;
  }
}
