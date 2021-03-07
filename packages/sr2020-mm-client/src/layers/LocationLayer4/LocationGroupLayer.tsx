import React, { Component } from 'react';
import { L, CommonLayerProps } from "sr2020-mm-client-core";
import { WithTranslation } from "react-i18next";
import * as R from 'ramda';

import { getArrDiff } from 'sr2020-mm-event-engine';

import { WithLocationRecords } from '../../dataHOCs';
import { BasicLocation, basicLocation } from "../../types";

interface LocationGroupLayerProps {
  enableByDefault: boolean;
  enableLayerIndex: any;
  geoLayerName: any;
  nameKey: any;
  onLocationClick: any;
  onLocationEdit: any;
}

export class LocationGroupLayer extends Component<
  LocationGroupLayerProps &
  CommonLayerProps &
  WithTranslation &
  WithLocationRecords
> {
  group = L.layerGroup([]);

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
      enableByDefault, layerCommunicator, locationRecords, enableLayerIndex = {}, geoLayerName,
    } = this.props;

    layerCommunicator.emit('setLayersMeta', {
      layersMeta: this.getLayersMeta(),
      enableByDefault: enableLayerIndex[geoLayerName] || enableByDefault,
    });
    this.updateLocations({
      added: (locationRecords),
    });
    // console.log('LocationGroupLayer mounted');
  }

  componentDidUpdate(prevProps) {
    const {
      translator, locationRecords,
    } = this.props;
    if (prevProps.locationRecords !== locationRecords) {
      const diff = getArrDiff(
        (locationRecords),
        (prevProps.locationRecords),
        R.prop('id'),
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
    // console.log('LocationGroupLayer did update');
  }

  componentWillUnmount() {
    this.clear();
    // this.communicatorSubscribe('off');
    // console.log('LocationGroupLayer will unmount');
  }

  getLayersMeta() {
    const { nameKey } = this.props;
    return {
      [nameKey]: this.group,
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

  createLocation(locationRecord) {
    const { t, onLocationClick, onLocationEdit } = this.props;
    const {
      polygon, label, id, layer_id, options,
    } = locationRecord;
    // const loc = L.polygon([polygon[0]], {
    const loc = basicLocation([polygon[0]], {
      id, label, layer_id, color: options.color, weight: options.weight, fillOpacity: options.fillOpacity,
    });
    loc.on('mouseover', function (this: BasicLocation, e) {
      let tooltipTemplate;
      switch (layer_id) {
      case 1:
        tooltipTemplate = 'geoLocationTooltip';
        break;
      case 2:
        tooltipTemplate = 'regionTooltip';
        break;
      case 3:
        tooltipTemplate = 'gameLocationTooltip';
        break;
      default:
        tooltipTemplate = 'unknownLocationTypeTooltip';
      }
      loc.bindTooltip(t(tooltipTemplate, { name: this.options.label }));
      this.openTooltip();
    });
    loc.on('mouseout', function (this: BasicLocation, e) {
      this.closeTooltip();
    });
    loc.on('click', onLocationClick);
    loc.on('pm:edit', onLocationEdit);
    // loc.on({
    //   click: onLocationClick,
    //   'pm:edit': onLocationEdit,
    // });
    this.group.addLayer(loc);
  }

  updateLocation({ item }) {
    const {
      polygon, label, id, layer_id, options,
    } = item;
    const location = this.group.getLayers().find((layer: BasicLocation) => layer.options.id === id) as BasicLocation;
    location.setLatLngs([polygon[0]]);
    L.Util.setOptions(location, { label });
    location.setStyle({ color: options.color, weight: options.weight, fillOpacity: options.fillOpacity });
  }

  removeLocation(locationRecord) {
    const { id } = locationRecord;
    const location = this.group.getLayers().find((layer: BasicLocation) => layer.options.id === id);
    this.group.removeLayer(location);
  }

  render() {
    return null;
  }
}
