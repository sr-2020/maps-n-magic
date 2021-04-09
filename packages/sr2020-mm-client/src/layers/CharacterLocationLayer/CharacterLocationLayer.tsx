import React, { Component } from 'react';
import { L, CommonLayerProps } from "sr2020-mm-client-core";
import * as R from 'ramda';
import './CharacterLocationLayer.css';
import { 
  WithLocationRecords,
  WithCharacterPosition
} from "../../dataHOCs";

import {
  getPolygonCentroid,
  LocationRecord
} from 'sr2020-mm-event-engine';

interface CharacterLocationLayerProps extends CommonLayerProps, WithLocationRecords, WithCharacterPosition {
  enableByDefault: boolean;
}

export class CharacterLocationLayer extends Component<
  CharacterLocationLayerProps
> {
  group = L.layerGroup([]);

  nameKey = 'characterLocationLayer';

  marker: L.Marker = null;

  constructor(props: CharacterLocationLayerProps) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const {
      enableByDefault, layerCommunicator,
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

  createMarker(location: LocationRecord) {
    this.marker = L.marker(getPolygonCentroid(location.polygon));
    this.group.addLayer(this.marker);
  }

  updateMarker(location: LocationRecord) {
    this.marker.setLatLng(getPolygonCentroid(location.polygon));
  }

  removeMarker() {
    if (this.marker) {
      this.group.clearLayers();
      this.marker = null;
    }
  }

  render(): null {
    const {
      locationRecords, characterLocationId,
    } = this.props;
    if (characterLocationId && locationRecords) {
      const location = locationRecords.find((loc) => loc.id === characterLocationId);
      // @ts-ignore
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
