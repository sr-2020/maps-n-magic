import React, { Component } from 'react';
import './RealTrackDemo.css';


import L from 'leaflet/dist/leaflet-src';
import * as R from 'ramda';

import * as Hotline from 'leaflet-hotline';

import { classNames } from 'classnames';
import { getIcon } from '../../../../utils/icons';

// require('leaflet-hotline')(L);

import { COLOR_PALETTE } from '../../../../utils/colorPalette';

// import { RealTrackDemoPropTypes } from '../../types';

// console.log('BeaconUtils', BeaconUtils);

// console.log('Hotline', Hotline);

const defaultOptions = {
  // id: userName,
  // color: COLOR_PALETTE[index % COLOR_PALETTE.length].color.background,
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
};

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
      enableByDefault, layerCommunicator, tracksData, beaconLatlngs,
    } = this.props;
    // this.subscribe('on', gameModel);
    this.populate(tracksData, beaconLatlngs);
    layerCommunicator.emit('setLayersMeta', {
      layersMeta: this.getLayersMeta(),
      enableByDefault,
    });
    console.log('RealTrackDemo mounted');
  }

  componentDidUpdate(prevProps) {
    const {
      enableByDefault, layerCommunicator, tracksData, beaconLatlngs,
    } = this.props;
    if (prevProps.tracksData !== tracksData) {
      layerCommunicator.emit('removeLayersMeta', {
        layersMeta: this.getLayersMeta(),
      });
      this.clear();
      this.populate(tracksData, beaconLatlngs);
      layerCommunicator.emit('setLayersMeta', {
        layersMeta: this.getLayersMeta(),
        enableByDefault,
      });
    }
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
  // eslint-disable-next-line react/sort-comp
  // eslint-disable-next-line max-lines-per-function
  populate(tracksData2, beaconLatlngs) {
    // const {
    //   gameModel, translator,
    // } = this.props;

    beaconLatlngs.forEach((beacon, index) => {
      // const myIcon = L.divIcon({className: 'my-div-icon'});
      const marker = L.marker({
        lat: beacon.lat,
        lng: beacon.lng,
      }, { id: beacon.id });
      // const myIcon = L.divIcon({ className: 'my-div-icon' });
      // const myIcon = L.divIcon({
      //   iconSize: [25, 41],
      //   iconAnchor: [12, 41],
      //   popupAnchor: [1, -34],
      //   shadowSize: [41, 41],
      // });
      // marker.setIcon(index % 2 ? myIcon : getIcon('green'));
      // marker.setIcon(getIcon('green'));
      marker.bindTooltip(`${beacon.id}`, {
        direction: 'center',
        // offset: L.point(0, 0),
        permanent: true,
        className: 'real-track-marker',
      });
      marker.on('mouseover', (e) => {
        // marker.bindPopup(`${beacon.id}`);
        // this.openPopup();
        // const tooltip = L.Tooltip();
        // tooltip.setTooltipContent(`${beacon.id}`);
        // marker.bindTooltip(`${beacon.id}`, {
        //   direction: 'center',
        //   permanent: true,
        // });
        // marker.bindTooltip(tooltip);
        // this.openTooltip();
      });
      marker.on('mouseout', (e) => {
        // this.closePopup();
        // this.closeTooltip();
      });
      this.beaconGroup.addLayer(marker);
    });

    this.tracks = R.toPairs(tracksData2).map(([userId, user]) => {
      const group = L.layerGroup([]);
      const preparedTracks = user.tracks.map((trackData) => this.prepareTrack(trackData, user)).filter((data) => {
        if (data.preparedTrack.length < 2) {
          console.warn('User', user.userData.name, 'has track with', data.preparedTrack.length, 'points');
          return false;
        }
        return true;
      });

      const tracks = preparedTracks.map((data) => {
        const track = L.hotline(data.preparedTrack, {
          ...defaultOptions,
          min: data.min,
          max: data.max,
        });
        return track;
      });
      tracks.forEach(group.addLayer.bind(group));

      const points = R.sum(preparedTracks.map(R.pipe(R.prop('preparedTrack'), R.length)));

      return [`${user.userData.name} (id ${userId}, ${points} points, ${tracks.length} tracks)`, group];
    });

    const gpsTracks = R.toPairs(tracksData2).filter(([userId, user]) => !!user.gpsTrack && !R.isEmpty(user.gpsTrack)).map(([userId, user]) => {
      const { gpsTrack } = user;
      const group = L.layerGroup([]);
      const min = R.head(gpsTrack).timeMillis;
      const max = R.last(gpsTrack).timeMillis;
      // gpsTrack
      const track = L.hotline(gpsTrack.map((el) => ([el.lat, el.lng, el.timeMillis])), {
        ...defaultOptions,
        palette: {
          0.0: '#0000ff',
          0.25: '#000088',
          0.5: '#00ffff',
          0.75: '#00ff88',
          1.0: '#ffffff',
        },
        min,
        max,
      });
      group.addLayer(track);

      return [`${user.userData.name} gps track`, group];
    });

    this.tracks = R.concat(this.tracks, gpsTracks);

    this.tracks = R.fromPairs(this.tracks);
  }

  // eslint-disable-next-line class-methods-use-this
  prepareTrack(trackData, user) {
    const preparedTrack = trackData.map((el) => ([el.lat, el.lng, el.timeMillis])).filter((value, index, arr) => {
      if (arr[index + 1] && value[2] === arr[index + 1][2]) {
        console.warn('User', user.userData.name, 'has track with two measures with the equal time', value[2]);
        return false;
      }
      return true;
    });
    return {
      preparedTrack,
      min: R.head(preparedTrack)[2],
      max: R.last(preparedTrack)[2],
    };
  }

  clear() {
    this.beaconGroup.clearLayers();
    R.values(this.tracks).forEach((track) => track.clearLayers());
  }

  render() {
    return null;
  }
}
