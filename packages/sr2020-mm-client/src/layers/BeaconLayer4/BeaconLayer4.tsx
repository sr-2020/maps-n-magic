import React, { Component, ChangeEvent } from 'react';
import { WithTranslation } from 'react-i18next';
import './BeaconLayer4.css';

import { 
  L, 
  CommonLayerProps,
  OnCreateLayerEvent,
  OnRemoveLayerEvent
} from "sr2020-mm-client-core";
import * as R from 'ramda';

import { 
  GameModel, 
  BeaconRecord,
  PutBeaconRecord,
  BeaconPropChange,
} from 'sr2020-mm-event-engine';

import { CreateBeaconPopup } from './CreateBeaconPopup';
import { WithLatLngBeacons } from "./withLatLngBeacons";

import { getFreeBeaconIds } from './beaconUtils';
import { InnerBeaconLayer } from './InnerBeaconLayer';

interface BeaconLayer4Props extends CommonLayerProps, WithTranslation, WithLatLngBeacons {
  gameModel: GameModel;
  beaconRecords: BeaconRecord[];
  enableByDefault: boolean;
}

export interface CurBeacon {
  id: number;
  label: string;
  location_id: number | null;
}

interface BeaconLayer4State {
  beaconLatLng: L.LatLng | null;
  curBeacon: CurBeacon | null;
}

export class BeaconLayer4 extends Component<
  BeaconLayer4Props,
  BeaconLayer4State
> {
  beaconPopupContainer: HTMLElement;

  createBeaconPopup: L.Popup;

  updateBeaconRecordTimeoutId: NodeJS.Timeout | undefined;

  constructor(props: BeaconLayer4Props) {
    super(props);
    this.state = {
      curBeacon: null,
      beaconLatLng: null,
    };
    this.onCreateLayer = this.onCreateLayer.bind(this);
    this.onRemoveLayer = this.onRemoveLayer.bind(this);
    // this.onPutBeaconRecord = this.onPutBeaconRecord.bind(this);
    this.onSelectBeacon = this.onSelectBeacon.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.onBeaconEdit = this.onBeaconEdit.bind(this);
    this.onBeaconClick = this.onBeaconClick.bind(this);
    this.onLocationSelect = this.onLocationSelect.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    this.beaconPopupContainer = document.createElement('div');
    this.communicatorSubscribe('on');
    this.createBeaconPopup = L.popup();
    // console.log('BeaconLayer4 mounted');
  }

  componentDidUpdate() {
    // console.log('BeaconLayer4 did update');
  }

  componentWillUnmount() {
    this.communicatorSubscribe('off');
    // console.log('BeaconLayer4 will unmount');
  }

  // eslint-disable-next-line react/sort-comp
  communicatorSubscribe(action: 'on'|'off') {
    const { layerCommunicator } = this.props;
    layerCommunicator[action]('onCreateLayer', this.onCreateLayer);
    layerCommunicator[action]('onRemoveLayer', this.onRemoveLayer);
  }

  onCreateLayer(event: OnCreateLayerEvent) {
    const { translator, layerCommunicator } = this.props;
    if (event.layer instanceof L.Marker) {
      const beacon = event.layer as L.Marker;
      // const latlng = translator.moveFrom(beacon.getLatLng());
      const latlng = beacon.getLatLng();
      this.setState({
        beaconLatLng: latlng,
      });
      layerCommunicator.emit('openPopup', {
        popup: this.createBeaconPopup.setLatLng(latlng).setContent(this.beaconPopupContainer),
      });
      beacon.remove();
    }
  }

  onRemoveLayer(event: OnRemoveLayerEvent) {
    const {
      gameModel, translator, layerCommunicator,
    } = this.props;
    if (event.layer instanceof L.Marker) {
      const beacon = event.layer;
      gameModel.execute2<PutBeaconRecord>({
        type: 'putBeaconRecord',
        id: beacon.options.id,
        props: {
          lat: null,
          lng: null,
        },
      });
      // this.beaconLayer.onRemoveBeacon(event.layer, gameModel);
      layerCommunicator.emit('closePopup');
    }
  }

  onBeaconClick(e: L.LeafletMouseEvent) {
    const { layerCommunicator, translator, beaconRecords} = this.props;
    const {
      label, id, markers, manaLevel,
    } = e.target.options;
    // const latlng = translator.moveFrom(e.target.getLatLng());
    const latlng = e.target.getLatLng();
    const beacon = beaconRecords.find(el => el.id === id);
    this.setState({
      curBeacon: {
        id,
        label,
        location_id: beacon !== undefined ? beacon.location_id : null
      },
      beaconLatLng: latlng,
    });
    layerCommunicator.emit('openPopup', {
      popup: this.createBeaconPopup.setLatLng(latlng).setContent(this.beaconPopupContainer),
    });
  }

  onBeaconEdit(e: L.LeafletMouseEvent) {
    const {
      gameModel, translator,
    } = this.props;
    const beacon = e.target;
    // const latlng = translator.moveFrom(beacon.getLatLng());
    const latlng = beacon.getLatLng();
    gameModel.execute2<PutBeaconRecord>({
      type: 'putBeaconRecord',
      id: beacon.options.id,
      props: {
        ...latlng,
      },
    });
    this.closePopup();
  }

  closePopup() {
    const {
      layerCommunicator,
    } = this.props;
    layerCommunicator.emit('closePopup');
    this.setState({
      beaconLatLng: null,
      curBeacon: null,
    });
  }

  onSelectBeacon(latLng: L.LatLng, id: number): void {
    const {
      gameModel,
    } = this.props;
    const {
      curBeacon,
    } = this.state;
    this.setState({
      beaconLatLng: null,
    });
    gameModel.execute2<PutBeaconRecord>({
      type: 'putBeaconRecord',
      id,
      props: {
        ...latLng,
      },
    });
    if (curBeacon) {
      gameModel.execute2<PutBeaconRecord>({
        type: 'putBeaconRecord',
        id: curBeacon.id,
        props: {
          lat: null,
          lng: null,
        },
      });
      this.setState({
        curBeacon: null,
      });
    }
    this.closePopup();
  }

  onLocationSelect (beaconId: number, locationId: number | null) {
    const { gameModel } = this.props;

    gameModel.execute2<PutBeaconRecord>({
      type: 'putBeaconRecord',
      id: beaconId,
      props: {
        'location_id': locationId,
      },
    });
  }

  handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    const { target } = event;
    const { idStr } = event.target.dataset;
    const { value } = target;
    const name = target.name as 'bssid' | 'label';
    if(!['bssid','label'].includes(name)) {
      throw new Error('Unexpected beacon record prop name: ' + name);
    }
    this.putBeaconRecord(Number(idStr), {prop: name, value});
  }

  putBeaconRecord(id: number, propChange: BeaconPropChange): void {
    const { gameModel } = this.props;

    if (this.updateBeaconRecordTimeoutId !== undefined) {
      clearTimeout(this.updateBeaconRecordTimeoutId);
    }

    this.updateBeaconRecordTimeoutId = setTimeout(() => {
      gameModel.execute2<PutBeaconRecord>({
        type: 'putBeaconRecord',
        id,
        props: {
          [propChange.prop]: propChange.value,
        },
      });
    }, 500);
  }

  render() {
    const {
      beaconLatLng, curBeacon,
    } = this.state;
    const {
      beaconRecords, gameModel
    } = this.props;
    const freeBeaconIds = getFreeBeaconIds(beaconRecords);
    return (
      <>
        <InnerBeaconLayer
          // onRectangleClick={this.onRectangleClick}
          // onRectangleEdit={this.onRectangleEdit}
          onBeaconClick={this.onBeaconClick}
          onBeaconEdit={this.onBeaconEdit}
          {...this.props}
        />
        {
          !!beaconLatLng
          && (
            <CreateBeaconPopup
              latLng={beaconLatLng}
              curBeacon={curBeacon}
              freeBeaconIds={freeBeaconIds}
              onSelect={this.onSelectBeacon}
              onClose={this.closePopup}
              onLocationSelect={this.onLocationSelect}
              domContainer={this.beaconPopupContainer}
              gameModel={gameModel}
              handleInputChange={this.handleInputChange}
            />
          )
        }
      </>
    );
  }
}
