import React, { Component } from 'react';
import { L, getIcon, CommonLayerProps, iconColors } from "sr2020-mm-client-core";
import { WithCharacterHealthStatesForMap } from '../../dataHOCs';
import * as R from 'ramda';
import './RescueServiceLayer2.css';

import {
  isGeoLocation, 
  getArrDiff, 
  ArrDiff,
  getPolygonCentroid, 
  isClinicallyDead,
  CharacterHealthStatesByLocation,
  CharacterHealthState
} from 'sr2020-mm-event-engine';

import { LocationCentroid, makeLocationCentroid } from "../../types";

function hasDifference(
  item: CharacterHealthStatesByLocation, 
  prevItem: CharacterHealthStatesByLocation
): boolean {
  // polygon, label, options.manaLevel
  const list1 = R.pluck('characterId', item.characters.filter(isClinicallyDead));
  const list2 = R.pluck('characterId', prevItem.characters.filter(isClinicallyDead));
  return R.symmetricDifference(list1, list2).length > 0
    || R.equals(item.location.polygon, prevItem.location.polygon);
}

const preFilterCharacters = (list: CharacterHealthStatesByLocation[]) => 
  list.filter((item) => item.characters.some(isClinicallyDead));

interface RescueServiceLayer2Props extends CommonLayerProps, WithCharacterHealthStatesForMap {
  enableByDefault: boolean;
}

export class RescueServiceLayer2 extends Component<
  RescueServiceLayer2Props
> {
  group = L.layerGroup([]);

  nameKey = 'rescueServiceLayer';

  constructor(props: RescueServiceLayer2Props) {
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
    R.map(this.createMarker, preFilterCharacters(characterHealthByLocations));
    // this.updateMarkers({
    //   added: preFilterCharacters(characterHealthByLocations),
    // });
    // console.log('RescueServiceLayer2 mounted');
  }

  componentDidUpdate(prevProps: RescueServiceLayer2Props) {
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
    // console.log('RescueServiceLayer2 did update');
  }

  componentWillUnmount() {
    this.clear();
    // console.log('RescueServiceLayer2 will unmount');
  }

  getLayersMeta() {
    return {
      [this.nameKey]: this.group,
    };
  }

  updateMarkers({ added = [], removed = [], updated = [] }: ArrDiff<CharacterHealthStatesByLocation>) {
    R.map(this.createMarker, added);
    R.map(this.updateMarker, updated);
    R.map(this.removeMarker, removed);
  }

  clear() {
    this.group.clearLayers();
  }

  updateMarkerTooltip(marker: LocationCentroid, characters: CharacterHealthState[]) {
    marker.unbindTooltip();
    const deadCharacters = characters.filter(isClinicallyDead);
    // marker.bindTooltip(`id персонажей: ${R.pluck('userName', deadCharacters).join(', ')}`, {
    // marker.bindTooltip(`${R.pluck('userName', deadCharacters).join(', ')}`, {
    marker.bindTooltip(`${R.pluck('personName', deadCharacters).join(', ')}`, {
      permanent: true,
    });
  }

  createMarker(dataItem: CharacterHealthStatesByLocation) {
    const { location, locationId, characters } = dataItem;
    // const marker2 = L.marker(getPolygonCentroid(location.polygon), {
    const marker2 = makeLocationCentroid(getPolygonCentroid(location.polygon), {
      locationId,
    });
    marker2.setIcon(getIcon(iconColors.red));
    this.updateMarkerTooltip(marker2, characters);
    this.group.addLayer(marker2);
  }

  updateMarker({ item }: {
    item: CharacterHealthStatesByLocation
  }) {
    const { location, locationId, characters } = item;
    const marker = this.group.getLayers().find((marker2: LocationCentroid) => 
      marker2.options.locationId === item.locationId) as LocationCentroid;
    marker.setLatLng(getPolygonCentroid(location.polygon));
    this.updateMarkerTooltip(marker, characters);
  }

  removeMarker(locationData: CharacterHealthStatesByLocation) {
    const marker = this.group.getLayers().find((loc2: LocationCentroid) => 
      loc2.options.locationId === locationData.locationId);
      marker && this.group.removeLayer(marker);
  }

  render(): null {
    // const { characterHealthByLocations } = this.props;
    // console.log('characterHealthByLocations', characterHealthByLocations);
    return null;
  }
}
