import React, { Component } from 'react';
import { L, CommonLayerProps } from "sr2020-mm-client-core";
import * as R from 'ramda';
import './BeaconBindingsLayer.css';

import { WithBeaconBindingsData, BeaconBinding } from '../../dataHOCs';

import {
  getArrDiff, ArrDiff, ArrDiffUpdate
} from 'sr2020-mm-event-engine';

import { locNeighborLine, LocNeighborLine } from "../../types";

interface BeaconBindingsLayerProps extends CommonLayerProps, WithBeaconBindingsData {
  enableByDefault: boolean;
}

export class BeaconBindingsLayer extends Component<
  BeaconBindingsLayerProps
> {
  group = L.layerGroup([]);

  nameKey = 'beaconBindingsLayer';

  constructor(props: BeaconBindingsLayerProps) {
    super(props);
    this.state = {
    };
    this.createEdge = this.createEdge.bind(this);
    this.updateEdge = this.updateEdge.bind(this);
    this.removeEdge = this.removeEdge.bind(this);
  }

  componentDidMount() {
    const {
      enableByDefault, layerCommunicator, beaconBindings,
    } = this.props;
    layerCommunicator.emit('setLayersMeta', {
      layersMeta: this.getLayersMeta(),
      enableByDefault,
    });
    R.map(this.createEdge, beaconBindings);
  }

  componentDidUpdate(prevProps: BeaconBindingsLayerProps) {
    const {
      translator, beaconBindings,
    } = this.props;
    if (prevProps.beaconBindings !== beaconBindings) {
      const diff = getArrDiff(
        beaconBindings,
        prevProps.beaconBindings,
        R.prop('id'),
      );
      this.updateEdges(diff);
    }
  }

  componentWillUnmount() {
    this.clear();
  }

  getLayersMeta() {
    return {
      [this.nameKey]: this.group,
    };
  }

  updateEdges({ added = [], removed = [], updated = [] }: ArrDiff<BeaconBinding>) {
    R.map(this.createEdge, added);
    R.map(this.updateEdge, updated);
    R.map(this.removeEdge, removed);
  }

  clear() {
    this.group.clearLayers();
  }

  createEdge(dataItem: BeaconBinding) {
    const { id, locCentroidLatLng2, beaconLatLng1 } = dataItem;
    // just reuse lines from neighbors component
    const edge = locNeighborLine([beaconLatLng1, locCentroidLatLng2], {
      edgeId: id,
      color: 'green',
      pmIgnore: true
    });
    this.group.addLayer(edge);
  }

  updateEdge({ item }: ArrDiffUpdate<BeaconBinding>) {
    const { id, locCentroidLatLng2, beaconLatLng1 } = item;
    const edge = this.group.getLayers().find((edge2: LocNeighborLine) => edge2.options.edgeId === item.id) as LocNeighborLine;
    edge.setLatLngs([beaconLatLng1, locCentroidLatLng2]);
  }

  removeEdge(locationData: BeaconBinding) {
    const edge = this.group.getLayers().find((loc2: LocNeighborLine) => loc2.options.edgeId === locationData.id);
    edge && this.group.removeLayer(edge);
  }

  render(): null {
    return null;
  }
}
