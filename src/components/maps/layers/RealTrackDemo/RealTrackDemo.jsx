import React, { Component } from 'react';
import './RealTrackDemo.css';


import L from 'leaflet/dist/leaflet-src';
import * as R from 'ramda';

import * as Hotline from 'leaflet-hotline';

// require('leaflet-hotline')(L);

// import trackData from '../../../../dataAnalysis/playerTracks2.json';
import trackData from '../../../../dataAnalysis/pt3.json';

import { COLOR_PALETTE } from '../../../../utils/colorPalette';

console.log('Hotline', Hotline);

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

  // eslint-disable-next-line max-lines-per-function
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
    const getNoise = () => (Math.random() - 0.5) / 20000;
    const addNoise = ([lat, lng]) => [lat + getNoise(), lng + getNoise()];
    const addNoise2 = (obj) => ({
      ...obj,
      lat: obj.lat + getNoise(),
      lng: obj.lng + getNoise(),
    });
    this.tracks = R.toPairs(trackData.userTracks).map(([userName, userTrack]) => {
      const group = L.layerGroup([]);
      // const track = L.polyline(userTrack.map(R.prop('latlng')).map(addNoise), {
      const track = L.hotline(userTrack.map((el) => ({
        lat: el.latlng[0],
        lng: el.latlng[1],
        z: new Date(el.time).getTime(),
      })).map(addNoise2).map((el) => [el.lat, el.lng, el.z]), {
        id: userName,
        color: COLOR_PALETTE[index % COLOR_PALETTE.length].color.background,
        min: new Date(R.head(userTrack).time).getTime(),
        max: new Date(R.last(userTrack).time).getTime(),
        // palette: {
        //   0.0: '#00000000',
        //   1.0: '#ffffffff',
        // },
        palette: {
          0.0: '#00ff00',
          0.25: '#008800',
          0.5: '#ffff00',
          0.75: '#ff8800',
          1.0: '#ff0000',
        },
        weight: 5,
        outlineColor: '#000000',
        outlineWidth: 1,
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
