import React, { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import { L, CommonLayerProps, getIcon, iconColors } from "sr2020-mm-client-core";
import * as R from 'ramda';

import { 
  getArrDiff, 
  BeaconRecord, 
  ArrDiffUpdate, 
  ArrDiff,
  LatLngBeaconRecord,
  GameModel,
  GetLocationRecord
} from 'sr2020-mm-event-engine';
import { WithLatLngBeacons } from "./withLatLngBeacons";

import { Beacon, makeBeacon } from "../../types";

interface InnerBeaconLayerProps extends CommonLayerProps, WithTranslation, WithLatLngBeacons {
  enableByDefault: boolean;
  onBeaconClick: L.LeafletEventHandlerFn;
  onBeaconEdit: L.LeafletEventHandlerFn;
  gameModel: GameModel;
}

export class InnerBeaconLayer extends Component<
  InnerBeaconLayerProps
> {
  group = L.layerGroup([]);

  nameKey = 'beaconsLayer';

  constructor(props: InnerBeaconLayerProps) {
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
    R.map(this.createBeacon, latLngBeaconRecords);
    // this.updateBeacons({
    //   added: (latLngBeaconRecords),
    // });
    console.log('InnerManaOceanLayer2 mounted');
  }

  componentDidUpdate(prevProps: InnerBeaconLayerProps) {
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

  updateBeacons({ added = [], removed = [], updated = [] }: ArrDiff<LatLngBeaconRecord>) {
    R.map(this.createBeacon, added);
    R.map(this.updateBeacon, updated);
    R.map(this.removeBeacon, removed);
  }

  clear() {
    this.group.clearLayers();
  }

  createBeacon(beaconRecord: LatLngBeaconRecord) {
    const { t } = this.props;
    const { onBeaconClick, onBeaconEdit } = this.props;
    // const imagesData = gameModel.get('backgroundImages').map(translator.moveTo);

    const {
      lat, lng, label, id
    } = beaconRecord;
    // const beacon = L.marker({ lat, lng }, {
    const beacon = makeBeacon({ lat, lng }, {
      id, label,
    });
    this.setIcon(beacon, beaconRecord);
    beacon.on('mouseover', function (this: Beacon, e) {
      beacon.bindTooltip(t('markerTooltip', { name: this.options.label }));
      this.openTooltip();
    });
    beacon.on('mouseout', function (this: Beacon, e) {
      this.closeTooltip();
    });

    beacon.on('click', onBeaconClick);
    beacon.on('pm:edit', onBeaconEdit);

    this.group.addLayer(beacon);
  }

  updateBeacon({ item }: ArrDiffUpdate<LatLngBeaconRecord>) {
    const {
      lat, lng, label, id, location_id
    } = item;
    const marker = this.group.getLayers().find((rect2: Beacon) => rect2.options.id === id) as Beacon;
    this.setIcon(marker, item);
    marker.setLatLng({ lat, lng });
    L.Util.setOptions(marker, { label });
  }

  setIcon(beacon: Beacon, beaconRecord: BeaconRecord) {
    const { gameModel } = this.props;
    const {
      location_id
    } = beaconRecord;
    if (location_id !== null) {
      const location = gameModel.get2<GetLocationRecord>({
        type: 'locationRecord',
        id: location_id
      });
      beacon.setIcon(getIcon(location === null ? iconColors.red : iconColors.blue));
    } else {
      beacon.setIcon(getIcon(iconColors.red));
    }
  }

  removeBeacon(beaconRecord: LatLngBeaconRecord) {
    const { id } = beaconRecord;
    const marker = this.group.getLayers().find((marker2: Beacon) => marker2.options.id === id);
    marker && this.group.removeLayer(marker);
  }

  render(): null {
    return null;
  }
}
