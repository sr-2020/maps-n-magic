import React, { Component } from 'react';
import './BeaconLayer4.css';

import { L } from "sr2020-mm-client-core";
import * as R from 'ramda';

import { CreateBeaconPopup } from './CreateBeaconPopup';

import { getFreeBeaconIds } from './beaconUtils';
import { InnerBeaconLayer } from './InnerBeaconLayer.jsx';

export class BeaconLayer4 extends Component {
  constructor(props) {
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
  }

  componentDidMount() {
    this.beaconPopupContainer = document.createElement('div');
    this.communicatorSubscribe('on');
    this.createBeaconPopup = L.popup();
    console.log('BeaconLayer4 mounted');
  }

  componentDidUpdate() {
    console.log('BeaconLayer4 did update');
  }

  componentWillUnmount() {
    this.communicatorSubscribe('off');
    console.log('BeaconLayer4 will unmount');
  }

  // eslint-disable-next-line react/sort-comp
  communicatorSubscribe(action) {
    const { layerCommunicator } = this.props;
    layerCommunicator[action]('onCreateLayer', this.onCreateLayer);
    layerCommunicator[action]('onRemoveLayer', this.onRemoveLayer);
  }

  onCreateLayer(event) {
    const { translator, layerCommunicator } = this.props;
    if (event.layer instanceof L.Marker) {
      const beacon = event.layer;
      const latlng = translator.moveFrom(beacon.getLatLng());
      this.setState({
        beaconLatLng: latlng,
      });
      layerCommunicator.emit('openPopup', {
        popup: this.createBeaconPopup.setLatLng(latlng).setContent(this.beaconPopupContainer),
      });
      beacon.remove();
    }
  }

  onRemoveLayer(event) {
    const {
      gameModel, translator, closePopup, layerCommunicator,
    } = this.props;
    if (event.layer instanceof L.Marker) {
      const beacon = event.layer;
      gameModel.execute({
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

  onBeaconClick = (e) => {
    const { layerCommunicator, translator } = this.props;
    const {
      label, id, markers, manaLevel,
    } = e.target.options;
    const latlng = translator.moveFrom(e.target.getLatLng());
    this.setState({
      curBeacon: {
        id,
        label,
      },
      beaconLatLng: latlng,
    });
    layerCommunicator.emit('openPopup', {
      popup: this.createBeaconPopup.setLatLng(latlng).setContent(this.beaconPopupContainer),
    });
  }

  onBeaconEdit = (e) => {
    const {
      gameModel, translator,
    } = this.props;
    const beacon = e.target;
    const latlng = translator.moveFrom(beacon.getLatLng());
    gameModel.execute({
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

  onSelectBeacon(latLng, id) {
    const {
      gameModel,
    } = this.props;
    const {
      curBeacon,
    } = this.state;
    this.setState({
      beaconLatLng: null,
    });
    gameModel.execute({
      type: 'putBeaconRecord',
      id,
      props: {
        ...latLng,
      },
    });
    if (curBeacon) {
      gameModel.execute({
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

  render() {
    const {
      beaconLatLng, curBeacon,
    } = this.state;
    const {
      beaconRecords,
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
              domContainer={this.beaconPopupContainer}
            />
          )
        }
      </>
    );
  }
}
