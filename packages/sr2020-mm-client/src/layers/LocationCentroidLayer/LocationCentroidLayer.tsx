import React, { Component } from 'react';
import { L, CommonLayerProps } from "sr2020-mm-client-core";
import * as R from 'ramda';
import './LocationCentroidLayer.css';

import { WithTriangulationData } from '../../dataHOCs';

import {
  getArrDiff, TriangulationCentroid, ArrDiffUpdate, ArrDiff
} from 'sr2020-mm-event-engine';

import { makeLocationCentroid, LocationCentroid } from "../../types";

interface LocationCentroidLayerProps extends CommonLayerProps, WithTriangulationData {
  enableByDefault: boolean;
}

export class LocationCentroidLayer extends Component<
  LocationCentroidLayerProps
> {
  group = L.layerGroup([]);

  nameKey = 'locationCentroidLayer';

  constructor(props: LocationCentroidLayerProps) {
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
    R.map(this.createMarker, centroids);
    // this.updateMarkers({
    //   added: centroids,
    // });
    // console.log('LocationCentroidLayer mounted');
  }

  componentDidUpdate(prevProps: LocationCentroidLayerProps) {
    const {
      translator, centroids,
    } = this.props;
    if (prevProps.centroids !== centroids) {
      const diff = getArrDiff<TriangulationCentroid>(
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

  updateMarkers({ added = [], removed = [], updated = [] }: ArrDiff<TriangulationCentroid>) {
    R.map(this.createMarker, added);
    R.map(this.updateMarker, updated);
    R.map(this.removeMarker, removed);
  }

  clear() {
    this.group.clearLayers();
  }

  createMarker(dataItem: TriangulationCentroid) {
    const { locationId, centroidLatLng } = dataItem;
    // const marker2 = L.marker(centroidLatLng, {
    const marker2 = makeLocationCentroid(centroidLatLng, {
      locationId,
    });
    this.group.addLayer(marker2);
  }

  updateMarker({ item }: ArrDiffUpdate<TriangulationCentroid>) {
    const { centroidLatLng } = item;
    const marker = this.group.getLayers().find((marker2: LocationCentroid) => marker2.options.locationId === item.locationId) as LocationCentroid;
    marker.setLatLng(centroidLatLng);
  }

  removeMarker(locationData: TriangulationCentroid) {
    const marker = this.group.getLayers().find((loc2: LocationCentroid) => loc2.options.locationId === locationData.locationId);
    marker && this.group.removeLayer(marker);
  }

  render(): null {
    return null;
  }
}
