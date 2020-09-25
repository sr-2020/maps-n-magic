import React, { Component } from 'react';
import L from 'leaflet/dist/leaflet-src';
import * as R from 'ramda';

import { getArrDiff } from 'sr2020-mm-event-engine/utils';

export class InnerBeaconLayer extends Component {
  group = L.layerGroup([]);

  nameKey = 'beaconsLayer';

  constructor(props) {
    super(props);
    this.state = {
    };
    this.createBeacon = this.createBeacon.bind(this);
    this.updateBeacon = this.updateBeacon.bind(this);
    this.removeBeacon = this.removeBeacon.bind(this);
  }

  componentDidMount() {
    const {
      enableByDefault, layerCommunicator, latLngBeaconRecords,
    } = this.props;
    layerCommunicator.emit('setLayersMeta', {
      layersMeta: this.getLayersMeta(),
      enableByDefault,
    });
    this.updateBeacons({
      added: (latLngBeaconRecords),
    });
    console.log('InnerManaOceanLayer2 mounted');
  }

  componentDidUpdate(prevProps) {
    const {
      translator, latLngBeaconRecords,
    } = this.props;
    if (prevProps.latLngBeaconRecords !== latLngBeaconRecords) {
      const diff = getArrDiff(
        (latLngBeaconRecords),
        (prevProps.latLngBeaconRecords),
        R.prop('id'),
      );
      this.updateBeacons(diff);
    //   this.subscribe('off', prevProps.gameModel);
    //   this.subscribe('on', gameModel);
    //   this.clear();
    //   this.populate();
    }
    if (prevProps.translator !== translator) {
      // this.clear();
      // this.populate();
    }
    console.log('InnerManaOceanLayer2 did update');
  }

  componentWillUnmount() {
    this.clear();
    // this.communicatorSubscribe('off');
    console.log('InnerManaOceanLayer2 will unmount');
  }

  getLayersMeta() {
    return {
      [this.nameKey]: this.group,
    };
  }

  updateBeacons({ added = [], removed = [], updated = [] }) {
    R.map(this.createBeacon, added);
    R.map(this.updateBeacon, updated);
    R.map(this.removeBeacon, removed);
  }

  clear() {
    this.group.clearLayers();
  }

  createBeacon(beaconRecord) {
    const { t } = this.props;
    const { onBeaconClick, onBeaconEdit } = this.props;
    // const imagesData = gameModel.get('backgroundImages').map(translator.moveTo);

    const {
      lat, lng, label, id,
    } = beaconRecord;
    const beacon = L.marker({ lat, lng }, {
      id, label,
    });
    beacon.on('mouseover', function (e) {
      beacon.bindTooltip(t('markerTooltip', { name: this.options.label }));
      this.openTooltip();
    });
    beacon.on('mouseout', function (e) {
      this.closeTooltip();
    });

    beacon.on({
      click: onBeaconClick,
      'pm:edit': onBeaconEdit,
    });

    this.group.addLayer(beacon);
  }

  updateBeacon({ item }) {
    const {
      lat, lng, label, id,
    } = item;
    const marker = this.group.getLayers().find((rect2) => rect2.options.id === id);
    marker.setLatLng({ lat, lng });
    L.setOptions(marker, { label });
  }

  removeBeacon(beaconRecord) {
    const { id } = beaconRecord;
    const marker = this.group.getLayers().find((marker2) => marker2.options.id === id);
    this.group.removeLayer(marker);
  }

  render() {
    return null;
  }
}
