import React, { Component } from 'react';
import './UserLayer2.css';

import { L } from "sr2020-mm-client-core";
import * as R from 'ramda';

// import { UserLayer2PropTypes } from '../../types';

export class UserLayer2 extends Component {
  // static propTypes = UserLayer2PropTypes;

  group = L.layerGroup([]);

  nameKey = 'userLayer';

  constructor(props) {
    super(props);
    this.state = {
    };
    this.onUserPositionUpdate = this.onUserPositionUpdate.bind(this);
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
    console.log('UserLayer2 mounted');
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
    console.log('UserLayer2 did update');
  }

  componentWillUnmount() {
    this.clear();
    const {
      gameModel,
    } = this.props;
    this.subscribe('off', gameModel);
    console.log('UserLayer2 will unmount');
  }

  // eslint-disable-next-line react/sort-comp
  populate() {
    const {
      gameModel,
    } = this.props;

    const user = gameModel.get('user');
    this.onUserPositionUpdate({ user });
  }

  subscribe(action, gameModel) {
    gameModel[action]('userPositionUpdate', this.onUserPositionUpdate);
  }

  onUserPositionUpdate({ user }) {
    const {
      translator,
    } = this.props;
    const layers = this.group.getLayers();
    const hasUser = layers.length > 0;
    const coords = user && user.pos && user.pos.coords;
    const latlng = coords ? {
      lat: coords.latitude,
      lng: coords.longitude,
    } : null;
    if (!coords && !hasUser) {
      return;
    }
    if (!coords && hasUser) {
      this.group.removeLayer(layers[0]);
    }
    if (coords && !hasUser) {
      const { markerClass: MarkerClass, markerStyle } = L.Control.Locate.prototype.options;
      const userMarker = new MarkerClass(translator.moveTo(latlng), markerStyle);
      this.group.addLayer(userMarker);
    }
    if (coords && hasUser) {
      layers[0].setLatLng(translator.moveTo(latlng));
    }
  }

  getLayersMeta() {
    return {
      [this.nameKey]: this.group,
    };
  }

  clear() {
    this.group.clearLayers();
  }

  render() {
    return null;
  }
}
