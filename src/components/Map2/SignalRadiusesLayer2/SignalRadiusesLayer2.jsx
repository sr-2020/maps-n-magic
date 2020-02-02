import React, { Component } from 'react';
import './SignalRadiusesLayer2.css';

import L from 'leaflet/dist/leaflet-src';
import * as R from 'ramda';

// import { SignalRadiusesLayer2PropTypes } from '../../types';

export class SignalRadiusesLayer2 extends Component {
  // static propTypes = SignalRadiusesLayer2PropTypes;
  group = L.layerGroup([]);

  nameKey = 'signalRadiusesLayer';

  constructor(props) {
    super(props);
    this.state = {
    };
    this.updateSignalRadiuses = this.updateSignalRadiuses.bind(this);
  }

  componentDidMount() {
    const {
      gameModel, enableByDefault, layerCommunicator,
    } = this.props;
    this.subscribe('on', gameModel);
    layerCommunicator.emit('setLayersMeta', {
      layersMeta: this.getLayersMeta(),
      enableByDefault,
    });
    this.populate();
    console.log('SignalRadiusesLayer2 mounted');
  }

  componentDidUpdate(prevProps) {
    const { gameModel, translator } = this.props;
    if (prevProps.gameModel !== gameModel) {
      this.subscribe('off', prevProps.gameModel);
      this.subscribe('on', gameModel);
      this.clear();
      this.populate();
    }
    if (prevProps.translator !== translator) {
      this.clear();
      this.populate();
    }
    console.log('SignalRadiusesLayer2 did update');
  }

  componentWillUnmount() {
    this.clear();
    const {
      gameModel,
    } = this.props;
    this.subscribe('off', gameModel);
    console.log('SignalRadiusesLayer2 will unmount');
  }

  getLayersMeta() {
    return {
      [this.nameKey]: this.group,
    };
  }

  subscribe(action, gameModel) {
    gameModel[action]('putBeacon', this.updateSignalRadiuses);
    gameModel[action]('postBeacon', this.updateSignalRadiuses);
    gameModel[action]('deleteBeacon', this.updateSignalRadiuses);
  }

  populate() {
    const {
      gameModel, translator,
    } = this.props;
    gameModel.get('beacons').map(translator.moveTo).forEach((beacon) => {
      this.group.addLayer(L.circle({
        lat: beacon.lat,
        lng: beacon.lng,
      }, {
        radius: 13,
        pmIgnore: true,
      }));
    });
  }


  updateSignalRadiuses() {
    this.clear();
    this.populate();
  }

  clear() {
    this.group.clearLayers();
  }

  render() {
    return null;
  }
}
