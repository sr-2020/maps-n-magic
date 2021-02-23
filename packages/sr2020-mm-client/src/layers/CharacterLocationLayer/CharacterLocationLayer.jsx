import React, { Component } from 'react';
import { L } from "sr2020-mm-client-core/leafletWrapper";
import * as R from 'ramda';
import './CharacterLocationLayer.css';

import {
  getPolygonCentroid,
} from 'sr2020-mm-event-engine';

export class CharacterLocationLayer extends Component {
  group = L.layerGroup([]);

  nameKey = 'characterLocationLayer';

  marker = null;

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const {
      enableByDefault, layerCommunicator, edges,
    } = this.props;
    layerCommunicator.emit('setLayersMeta', {
      layersMeta: this.getLayersMeta(),
      enableByDefault,
    });
    // console.log('CharacterLocationLayer mounted');
  }

  componentDidUpdate() {
    // console.log('CharacterLocationLayer did update');
  }

  componentWillUnmount() {
    this.clear();
    // console.log('CharacterLocationLayer will unmount');
  }

  getLayersMeta() {
    return {
      [this.nameKey]: this.group,
    };
  }

  clear() {
    this.group.clearLayers();
  }

  createMarker(location) {
    this.marker = L.marker(getPolygonCentroid(location.polygon));
    this.group.addLayer(this.marker);
  }

  updateMarker(location) {
    this.marker.setLatLng(getPolygonCentroid(location.polygon));
  }

  removeMarker() {
    if (this.marker) {
      this.group.clearLayers();
      this.marker = null;
    }
  }

  render() {
    const {
      locationRecords, characterLocationId,
    } = this.props;
    if (characterLocationId && locationRecords) {
      const location = locationRecords.find((loc) => loc.id === characterLocationId);
      if (location.polygon && !R.equals(location.polygon, {})) {
        if (this.marker) {
          this.updateMarker(location);
        } else {
          this.createMarker(location);
        }
      } else {
        this.removeMarker();
      }
    } else {
      this.removeMarker();
    }
    // console.log('render', characterLocationId, locationRecords);
    return null;
  }
}
