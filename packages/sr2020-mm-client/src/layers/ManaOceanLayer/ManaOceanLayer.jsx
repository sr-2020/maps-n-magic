import React, { Component } from 'react';
import L from 'leaflet/dist/leaflet-src';
import * as R from 'ramda';
import './ManaOceanLayer.css';

import { isGeoLocation, getArrDiff } from 'sr2020-mm-event-engine/utils';

const manaFillColors = { // based on h202
  1: 'white', // hsla(202, 60%, 90%, 1)
  2: '#c4deee', // hsla(202, 55%, 85%, 1)
  3: '#7dc1e8', // hsla(202, 70%, 70%, 1)
  4: '#2ba6ee', // hsla(202, 85%, 55%, 1)
  5: '#0081cc', // hsla(202, 100%, 40%, 1)
};

const isNotEmptyPolygon = R.pipe(
  R.prop('polygon'),
  R.equals({}),
  R.not,
);

const filterLocationRecords = R.pipe(
  R.filter(isGeoLocation),
  R.filter(isNotEmptyPolygon),
);

function hasLocationDifference(item, prevItem) {
  // polygon, label, options.manaLevel
  return !R.equals(item.polygon, prevItem.polygon)
    || !R.equals(item.label, prevItem.label)
    || item.options.manaLevel !== prevItem.options.manaLevel;
}

export class ManaOceanLayer extends Component {
  group = L.layerGroup([]);

  nameKey = 'manaOceanLayer';

  constructor(props) {
    super(props);
    this.state = {
    };
    this.createLocation = this.createLocation.bind(this);
    this.updateLocation = this.updateLocation.bind(this);
    this.removeLocation = this.removeLocation.bind(this);
  }

  componentDidMount() {
    const {
      enableByDefault, layerCommunicator, locationRecords,
    } = this.props;
    // this.subscribe('on', gameModel);
    // this.manaOceanLayer = new InnerManaOceanLayer();
    layerCommunicator.emit('setLayersMeta', {
      layersMeta: this.getLayersMeta(),
      enableByDefault,
    });
    this.updateLocations({
      added: filterLocationRecords(locationRecords),
    });
    console.log('InnerManaOceanLayer2 mounted');
  }

  componentDidUpdate(prevProps) {
    const {
      translator, locationRecords,
    } = this.props;
    if (prevProps.locationRecords !== locationRecords) {
      const diff = getArrDiff(
        filterLocationRecords(locationRecords),
        filterLocationRecords(prevProps.locationRecords),
        R.prop('id'),
        hasLocationDifference,
      );
      this.updateLocations(diff);
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
    console.log('InnerManaOceanLayer2 will unmount');
  }

  getLayersMeta() {
    return {
      [this.nameKey]: this.group,
    };
  }

  updateLocations({ added = [], removed = [], updated = [] }) {
    R.map(this.createLocation, added);
    R.map(this.updateLocation, updated);
    R.map(this.removeLocation, removed);
  }

  clear() {
    this.group.clearLayers();
  }

  updateLocation({ item }) {
    const { t } = this.props;
    const loc = this.group.getLayers().find((loc2) => loc2.options.id === item.id);
    loc.setLatLngs([item.polygon[0]]);
    const { manaLevel } = item.options;
    loc.setStyle({ fillColor: manaFillColors[manaLevel] });
    L.setOptions(loc, { label: item.label });
    loc.on('mouseover', function (e) {
      loc.bindTooltip(t('manaGeoLocationTooltip', { name: this.options.label, manaLevel }));
      this.openTooltip();
    });
  }

  createLocation(locationData) {
    const {
      polygon, label, id, layer_id, options,
    } = locationData;
    const { t, translator } = this.props;
    // const manaLevel = (id % 5) + 1;
    // const manaLevel = 5;
    // const manaLevel = 1;
    const loc = L.polygon([polygon[0]], {
      // id, label, layer_id, color: options.color, weight: options.weight, fillOpacity: options.fillOpacity,
      // id, label, layer_id, color: '#2d3748', weight: 2, dashArray: [10], fillColor: manaFillColors[manaLevel], fillOpacity: 1,
      id, label, layer_id, color: '#1a202c', weight: 2, dashArray: [7], fillColor: manaFillColors[options.manaLevel], fillOpacity: 1,
    });
    loc.on('mouseover', function (e) {
      loc.bindTooltip(t('manaGeoLocationTooltip', { name: this.options.label, manaLevel: options.manaLevel }));
      this.openTooltip();
    });
    loc.on('mouseout', function (e) {
      this.closeTooltip();
    });
    this.group.addLayer(loc);
  }

  removeLocation(locationData) {
    const location = this.group.getLayers().find((loc2) => loc2.options.id === locationData.id);
    this.group.removeLayer(location);
  }

  render() {
    return null;
  }
}
