import React, { Component } from 'react';
import L from 'leaflet/dist/leaflet-src';
import * as R from 'ramda';
import './RescueServiceLayer2.css';

import { getIcon } from 'sr2020-mm-client-core/utils/icons';

import {
  isGeoLocation, getArrDiff, getPolygonCentroid, isClinicallyDead,
} from 'sr2020-mm-event-engine/utils';
// import { InnerRescueServiceLayer } from './InnerRescueServiceLayer';

// import { RescueServiceLayerPropTypes } from '../../types';

function hasDifference(item, prevItem) {
  // polygon, label, options.manaLevel
  const list1 = R.pluck('characterId', item.characters.filter(isClinicallyDead));
  const list2 = R.pluck('characterId', prevItem.characters.filter(isClinicallyDead));
  return R.symmetricDifference(list1, list2).length > 0
    || R.equals(item.location.polygon, prevItem.location.polygon);
}

const preFilterCharacters = (list) => list.filter((item) => item.characters.some(isClinicallyDead));

export class RescueServiceLayer2 extends Component {
  group = L.layerGroup([]);

  nameKey = 'rescueServiceLayer';

  constructor(props) {
    super(props);
    this.state = {
    };
    this.createMarker = this.createMarker.bind(this);
    this.updateMarker = this.updateMarker.bind(this);
    this.removeMarker = this.removeMarker.bind(this);
    // this.onСharacterHealthStateChanged = this.onСharacterHealthStateChanged.bind(this);
  }

  componentDidMount() {
    const {
      enableByDefault, layerCommunicator, characterHealthByLocations,
    } = this.props;
    // this.subscribe('on', gameModel);
    // this.manaOceanLayer = new InnerManaOceanLayer();
    layerCommunicator.emit('setLayersMeta', {
      layersMeta: this.getLayersMeta(),
      enableByDefault,
    });
    this.updateMarkers({
      added: preFilterCharacters(characterHealthByLocations),
    });
    console.log('InnerManaOceanLayer2 mounted');
  }

  componentDidUpdate(prevProps) {
    const {
      translator, characterHealthByLocations,
    } = this.props;
    if (prevProps.characterHealthByLocations !== characterHealthByLocations) {
      const diff = getArrDiff(
        preFilterCharacters(characterHealthByLocations),
        preFilterCharacters(prevProps.characterHealthByLocations),
        R.prop('locationId'),
        hasDifference,
      );
      this.updateMarkers(diff);
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

  updateMarkers({ added = [], removed = [], updated = [] }) {
    R.map(this.createMarker, added);
    R.map(this.updateMarker, updated);
    R.map(this.removeMarker, removed);
  }

  clear() {
    this.group.clearLayers();
  }

  updateMarkerTooltip(marker, characters) {
    marker.unbindTooltip();
    const deadCharacters = characters.filter(isClinicallyDead);
    // marker.bindTooltip(`id персонажей: ${R.pluck('userName', deadCharacters).join(', ')}`, {
    // marker.bindTooltip(`${R.pluck('userName', deadCharacters).join(', ')}`, {
    marker.bindTooltip(`${R.pluck('personName', deadCharacters).join(', ')}`, {
      permanent: true,
    });
  }

  createMarker(dataItem) {
    const { location, locationId, characters } = dataItem;
    const marker2 = L.marker(getPolygonCentroid(location.polygon), {
      locationId,
    });
    marker2.setIcon(getIcon('red'));
    this.updateMarkerTooltip(marker2, characters);
    this.group.addLayer(marker2);
  }

  updateMarker({ item }) {
    const { location, locationId, characters } = item;
    const marker = this.group.getLayers().find((marker2) => marker2.options.locationId === item.locationId);
    marker.setLatLng(getPolygonCentroid(location.polygon));
    this.updateMarkerTooltip(marker, characters);
  }

  removeMarker(locationData) {
    const marker = this.group.getLayers().find((loc2) => loc2.options.locationId === locationData.locationId);
    this.group.removeLayer(marker);
  }

  render() {
    // const { characterHealthByLocations } = this.props;
    // console.log('characterHealthByLocations', characterHealthByLocations);
    return null;
  }
}
