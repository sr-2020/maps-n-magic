import React, { Component } from 'react';
import './SpiritLayer.css';

import { WithSpiritLocationData, SpiritLocation } from '../../dataHOCs';
import { WithTranslation } from "react-i18next";
import { L, CommonLayerProps } from "sr2020-mm-client-core";
import * as R from 'ramda';
import moment from 'moment-timezone';

import { 
  LocationRecord,
  ArrDiffUpdate,
  ArrDiff,
  getArrDiff,
  getPolygonCentroid
} from 'sr2020-mm-event-engine';

import { 
  LocationCentroid, 
  makeLocationCentroid 
} from "../../types";
import { processForDisplay } from '../../i18n';

interface SpiritLayerProps extends 
  WithSpiritLocationData, 
  WithTranslation, 
  CommonLayerProps
{
  enableByDefault: boolean;
}

function hasLocationDifference(item: SpiritLocation, prevItem: SpiritLocation) {
  // polygon, label, spiritNames
  return !R.equals(item.polygon, prevItem.polygon)
    || !R.equals(item.label, prevItem.label)
    || !R.equals(item.spiritNames, prevItem.spiritNames)
}

export class SpiritLayer extends Component<
  SpiritLayerProps
> {
  group = L.layerGroup([]);

  nameKey = 'spiritLayer';

  constructor(props: SpiritLayerProps) {
    super(props);
    this.createSpiritMarker = this.createSpiritMarker.bind(this);
    this.updateSpiritMarker = this.updateSpiritMarker.bind(this);
    this.removeSpiritMarker = this.removeSpiritMarker.bind(this);
  }

  componentDidMount() {
    const {
      enableByDefault, layerCommunicator, spiritLocations
    } = this.props;
    layerCommunicator.emit('setLayersMeta', {
      layersMeta: this.getLayersMeta(),
      enableByDefault,
    });
    this.updateSpiritMarkers({
      added: spiritLocations,
    });
    // console.log('InnerManaOceanLayer2 mounted');
  }

  componentDidUpdate(prevProps: SpiritLayerProps) {
    const {
      spiritLocations,
    } = this.props;
    if (prevProps.spiritLocations !== spiritLocations) {
      const diff = getArrDiff<LocationRecord>(
        spiritLocations,
        prevProps.spiritLocations,
        R.prop('id'),
        hasLocationDifference,
      );
      this.updateSpiritMarkers(diff);
    }
    // console.log('InnerManaOceanLayer2 did update');
  }

  componentWillUnmount() {
    this.clear();
    // console.log('InnerManaOceanLayer2 will unmount');
  }

  getLayersMeta() {
    return {
      [this.nameKey]: this.group,
    };
  }

  updateSpiritMarkers({ added = [], removed = [], updated = [] }: Partial<ArrDiff<LocationRecord>>) {
    R.map(this.createSpiritMarker, added);
    R.map(this.updateSpiritMarker, updated);
    R.map(this.removeSpiritMarker, removed);
  }

  clear() {
    this.group.clearLayers();
  }

  updateMarkerTooltip(marker: LocationCentroid, spiritNames: string[]) {
    marker.unbindTooltip();
    // marker.bindTooltip(`${spiritNames.join(', ')}`, {
    marker.bindTooltip(processForDisplay(`${spiritNames.join('<br>')}`), {
      permanent: true,
    });
  }

  createSpiritMarker(locationData: SpiritLocation) {
    const { polygon, id, spiritNames } = locationData;
    const marker2 = makeLocationCentroid(getPolygonCentroid(polygon), {
      locationId: id,
    });
    // marker2.setIcon(getIcon(iconColors.red));
    this.updateMarkerTooltip(marker2, spiritNames);
    this.group.addLayer(marker2);
  }

  updateSpiritMarker({ item }: ArrDiffUpdate<SpiritLocation>) {
    const { polygon, id, spiritNames } = item;
    const marker = this.group.getLayers().find((marker2: LocationCentroid) => 
      marker2.options.locationId === id) as LocationCentroid;
    marker.setLatLng(getPolygonCentroid(polygon));
    this.updateMarkerTooltip(marker, spiritNames);
  }

  removeSpiritMarker(locationData: SpiritLocation) {
    const marker = this.group.getLayers().find((loc2: LocationCentroid) => 
      loc2.options.locationId === locationData.id);
    marker && this.group.removeLayer(marker);
  }

  render() {
    return null;
  }
}



