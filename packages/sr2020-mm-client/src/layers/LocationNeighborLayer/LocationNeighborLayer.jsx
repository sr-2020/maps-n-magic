import React, { Component } from 'react';
import L from 'leaflet/dist/leaflet-src';
import * as R from 'ramda';
import './LocationNeighborLayer.css';

import {
  getArrDiff,
} from 'sr2020-mm-event-engine/utils';

export class LocationNeighborLayer extends Component {
  group = L.layerGroup([]);

  nameKey = 'locationNeighborLayer';

  constructor(props) {
    super(props);
    this.state = {
    };
    this.createEdge = this.createEdge.bind(this);
    this.updateEdge = this.updateEdge.bind(this);
    this.removeEdge = this.removeEdge.bind(this);
  }

  componentDidMount() {
    const {
      enableByDefault, layerCommunicator, edges,
    } = this.props;
    layerCommunicator.emit('setLayersMeta', {
      layersMeta: this.getLayersMeta(),
      enableByDefault,
    });
    this.updateEdges({
      added: edges,
    });
    // console.log('LocationNeighborLayer mounted');
  }

  componentDidUpdate(prevProps) {
    const {
      translator, edges,
    } = this.props;
    if (prevProps.edges !== edges) {
      const diff = getArrDiff(
        edges,
        prevProps.edges,
        R.prop('edgeId'),
      );
      this.updateEdges(diff);
    }
    // console.log('LocationNeighborLayer did update');
  }

  componentWillUnmount() {
    this.clear();
    // console.log('LocationNeighborLayer will unmount');
  }

  getLayersMeta() {
    return {
      [this.nameKey]: this.group,
    };
  }

  updateEdges({ added = [], removed = [], updated = [] }) {
    R.map(this.createEdge, added);
    R.map(this.updateEdge, updated);
    R.map(this.removeEdge, removed);
  }

  clear() {
    this.group.clearLayers();
  }

  createEdge(dataItem) {
    const { edgeId, centroidLatLng1, centroidLatLng2 } = dataItem;
    const edge = L.polyline([centroidLatLng1, centroidLatLng2], {
      edgeId,
      color: 'red',
    });
    this.group.addLayer(edge);
  }

  updateEdge({ item }) {
    const { edgeId, centroidLatLng1, centroidLatLng2 } = item;
    const edge = this.group.getLayers().find((edge2) => edge2.options.edgeId === item.edgeId);
    // marker.setLatLng(centroidLatLng);
    edge.setLatLngs([centroidLatLng1, centroidLatLng2]);
  }

  removeEdge(locationData) {
    const edge = this.group.getLayers().find((loc2) => loc2.options.edgeId === locationData.edgeId);
    this.group.removeLayer(edge);
  }

  render() {
    return null;
  }
}
