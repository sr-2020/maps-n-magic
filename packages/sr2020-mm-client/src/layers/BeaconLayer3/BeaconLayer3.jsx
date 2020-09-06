import React, { Component } from 'react';
import './BeaconLayer3.css';

import L from 'leaflet/dist/leaflet-src';
import * as R from 'ramda';

import { CreateBeaconPopup } from './CreateBeaconPopup';
import { InnerBeaconLayer3 } from './InnerBeaconLayer3';

import { getFreeBeaconIds } from './beaconUtils';

// import { BeaconLayer3PropTypes } from '../../types';

export class BeaconLayer3 extends Component {
  // static propTypes = BeaconLayer3PropTypes;

  constructor(props) {
    super(props);
    this.state = {
      curBeacon: null,
      beaconLatLng: null,
    };
    this.onCreateLayer = this.onCreateLayer.bind(this);
    this.onRemoveLayer = this.onRemoveLayer.bind(this);
    this.onPutBeaconRecord = this.onPutBeaconRecord.bind(this);
    this.onSelectBeacon = this.onSelectBeacon.bind(this);
    this.closePopup = this.closePopup.bind(this);
  }

  componentDidMount() {
    const {
      gameModel, enableByDefault, layerCommunicator,
    } = this.props;
    this.beaconPopupContainer = document.createElement('div');
    this.subscribe('on', gameModel);
    this.communicatorSubscribe('on');
    this.createBeaconPopup = L.popup();
    this.beaconLayer = new InnerBeaconLayer3();
    layerCommunicator.emit('setLayersMeta', {
      layersMeta: this.beaconLayer.getLayersMeta(),
      enableByDefault,
    });
    this.populate();
    console.log('BeaconLayer3 mounted');
  }

  componentDidUpdate(prevProps) {
    const {
      gameModel, translator,
    } = this.props;
    if (prevProps.gameModel !== gameModel) {
      this.subscribe('off', prevProps.gameModel);
      this.subscribe('on', gameModel);
      this.clear();
      this.populate();
    }
    if (prevProps.translator !== translator) {
      this.clear();
      this.populate();
    }
    console.log('BeaconLayer3 did update');
  }

  componentWillUnmount() {
    const {
      gameModel,
    } = this.props;
    this.subscribe('off', gameModel);
    this.communicatorSubscribe('off');
    this.clear();
    console.log('BeaconLayer3 will unmount');
  }

  // eslint-disable-next-line react/sort-comp
  populate() {
    const {
      gameModel, t, translator,
    } = this.props;
    this.beaconLayer.populate(gameModel, translator, this.setBeaconEventHandlers, t);
  }

  clear() {
    this.beaconLayer.clear();
  }

  subscribe(action, gameModel) {
    gameModel[action]('putBeaconRecord', this.onPutBeaconRecord);
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

  onPutBeaconRecord({ beaconRecord }) {
    const { t } = this.props;
    this.beaconLayer.onPutBeaconRecord(beaconRecord, this.setBeaconEventHandlers, t);
  }

  onRemoveLayer(event) {
    const {
      gameModel, translator, closePopup, layerCommunicator,
    } = this.props;
    if (event.layer instanceof L.Marker) {
      this.beaconLayer.onRemoveBeacon(event.layer, gameModel);
      layerCommunicator.emit('closePopup');
    }
  }

  setBeaconEventHandlers = (beacon) => {
    beacon.on({
      click: this.onBeaconClick,
      'pm:edit': this.onBeaconEdit,
    });
    return beacon;
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
      gameModel, translator, layerCommunicator,
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

  // eslint-disable-next-line class-methods-use-this
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
    this.closePopup();
  }

  getCreateBeaconPopup() {
    const {
      beaconLatLng, curBeacon,
    } = this.state;
    const {
      gameModel,
    } = this.props;
    if (!beaconLatLng) {
      return null;
    }
    const freeBeaconIds = getFreeBeaconIds(gameModel.get('beaconRecords'));
    return (
      <CreateBeaconPopup
        latLng={beaconLatLng}
        curBeacon={curBeacon}
        freeBeaconIds={freeBeaconIds}
        onSelect={this.onSelectBeacon}
        onClose={this.closePopup}
        domContainer={this.beaconPopupContainer}
      />
    );
  }

  render() {
    return (
      <>
        {
          this.getCreateBeaconPopup()
        }
      </>
    );
  }
}
