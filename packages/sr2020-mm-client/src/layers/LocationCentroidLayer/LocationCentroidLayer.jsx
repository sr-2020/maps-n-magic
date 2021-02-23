import React, { Component } from 'react';
import { L } from "sr2020-mm-client-core/leafletWrapper";
import * as R from 'ramda';
import './LocationCentroidLayer.css';

import {
  getArrDiff,
} from 'sr2020-mm-event-engine';

export class LocationCentroidLayer extends Component {
  group = L.layerGroup([]);

  nameKey = 'locationCentroidLayer';

  constructor(props) {
    super(props);
    this.state = {
    };
    this.createMarker = this.createMarker.bind(this);
    this.updateMarker = this.updateMarker.bind(this);
    this.removeMarker = this.removeMarker.bind(this);
  }

  componentDidMount() {
    const {
      enableByDefault, layerCommunicator, centroids,
    } = this.props;
    layerCommunicator.emit('setLayersMeta', {
      layersMeta: this.getLayersMeta(),
      enableByDefault,
    });
    this.updateMarkers({
      added: centroids,
    });
    // console.log('LocationCentroidLayer mounted');
  }

  componentDidUpdate(prevProps) {
    const {
      translator, centroids,
    } = this.props;
    if (prevProps.centroids !== centroids) {
      const diff = getArrDiff(
        centroids,
        prevProps.centroids,
        R.prop('locationId'),
      );
      this.updateMarkers(diff);
    }
    // console.log('LocationCentroidLayer did update');
  }

  componentWillUnmount() {
    this.clear();
    // console.log('LocationCentroidLayer will unmount');
  }

  getLayersMeta() {
    return {
      [this.nameKey]: this.group,
    };
  }

  updateMarkers({ added = [], removed = [], updated = [] }) {
    R.map(this.createMarker, added);
    R.map(this.updateMarker, updated);
    R.map(this.removeMarker, removed);
  }

  clear() {
    this.group.clearLayers();
  }

  createMarker(dataItem) {
    const { locationId, centroidLatLng } = dataItem;
    const marker2 = L.marker(centroidLatLng, {
      locationId,
    });
    this.group.addLayer(marker2);
  }

  updateMarker({ item }) {
    const { location, centroidLatLng } = item;
    const marker = this.group.getLayers().find((marker2) => marker2.options.locationId === item.locationId);
    marker.setLatLng(centroidLatLng);
  }

  removeMarker(locationData) {
    const marker = this.group.getLayers().find((loc2) => loc2.options.locationId === locationData.locationId);
    this.group.removeLayer(marker);
  }

  render() {
    return null;
  }
}
