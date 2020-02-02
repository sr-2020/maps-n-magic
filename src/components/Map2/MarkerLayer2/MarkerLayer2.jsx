import React, { Component } from 'react';
import './MarkerLayer2.css';

import L from 'leaflet/dist/leaflet-src';

import { MarkerLayer } from '../MarkerLayer';

import { markerPopupDom } from '../../../utils/domUtils';

import { MarkerPopup } from '../MarkerPopup';

// import { MarkerLayer2PropTypes } from '../../types';

export class MarkerLayer2 extends Component {
  // static propTypes = MarkerLayer2PropTypes;

  constructor(props) {
    super(props);
    this.state = {
      curMarker: null,
    };
    this.onHighlightLocation_markers = this.onHighlightLocation_markers.bind(this);
    this.onResetHighlightLocation_markers = this.onResetHighlightLocation_markers.bind(this);
    this.updateMarkersView = this.updateMarkersView.bind(this);
    this.onCreateLayer = this.onCreateLayer.bind(this);
    this.onRemoveLayer = this.onRemoveLayer.bind(this);
  }

  componentDidMount() {
    const {
      gameModel, enableByDefault, layerCommunicator,
    } = this.props;
    this.subscribe('on', gameModel);
    this.communicatorSubscribe('on');
    this.markerPopup = L.popup();
    this.markerLayer = new MarkerLayer();
    layerCommunicator.emit('setLayersMeta', {
      layersMeta: this.markerLayer.getLayersMeta(),
      enableByDefault,
    });
    this.populate();
    console.log('MarkerLayer2 mounted');
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
    console.log('MarkerLayer2 did update');
  }

  componentWillUnmount() {
    const {
      gameModel,
    } = this.props;
    this.subscribe('off', gameModel);
    this.communicatorSubscribe('off');
    this.clear();
    console.log('MarkerLayer2 will unmount');
  }

  subscribe(action, gameModel) {
    // How putLocation can change markers view?
    // gameModel[action]('putLocation', this.updateMarkersView);
    gameModel[action]('deleteLocation', this.updateMarkersView);
  }

  onCreateLayer(event) {
    const { gameModel, translator } = this.props;
    if (event.layer instanceof L.Marker) {
      this.markerLayer.onCreateMarker(event.layer, gameModel, translator, this.setMarkerEventHandlers);
    }
  }

  onRemoveLayer(event) {
    const {
      gameModel, translator, closePopup, layerCommunicator,
    } = this.props;
    if (event.layer instanceof L.Marker) {
      this.markerLayer.onRemoveMarker(event.layer, gameModel, translator, this.setMarkerEventHandlers);
      // closePopup();
      layerCommunicator.emit('closePopup');
    }
  }

  updateMarkersView() {
    const { gameModel } = this.props;
    this.markerLayer.updateMarkersView(gameModel);
  }

  communicatorSubscribe(action) {
    const { layerCommunicator } = this.props;
    layerCommunicator[action]('highlightLocation', this.onHighlightLocation_markers);
    layerCommunicator[action]('resetLocationHighlight', this.onResetHighlightLocation_markers);
    layerCommunicator[action]('onCreateLayer', this.onCreateLayer);
    layerCommunicator[action]('onRemoveLayer', this.onRemoveLayer);
  }

  onHighlightLocation_markers({ location }) {
    // this is a communication between layers
    // need to add connector for such case
    const { markers } = location.options;
    this.markerLayer.highlightMarkers(markers);
  }

  onResetHighlightLocation_markers() {
    // this is a communication between layers
    // need to add connector for such case
    this.updateMarkersView();
  }

  setMarkerEventHandlers = (marker) => {
    const { layerCommunicator } = this.props;
    marker.on({
      click: (e) => {
        this.setState({
          curMarker: {
            lat: e.target.getLatLng().lat,
            lng: e.target.getLatLng().lng,
            name: e.target.options.name,
            id: e.target.options.id,
          },
        });
        layerCommunicator.emit('openPopup', {
          popup: this.markerPopup.setLatLng(e.latlng).setContent(markerPopupDom),
        });
      },
      'pm:edit': this.onMarkerEdit,
    });
  }

  populate() {
    const {
      gameModel, t, translator,
    } = this.props;
    this.markerLayer.populate(gameModel, translator, t, this.setMarkerEventHandlers);
  }

  clear() {
    this.markerLayer.clear();
  }

  onMarkerChange = (prop) => (e) => {
    const { value } = e.target;

    const { gameModel, translator } = this.props;
    const { id } = this.state.curMarker;
    const resValue = this.markerLayer.onMarkerChange(prop, value, gameModel, id, translator);
    this.setState((state) => {
      const curMarker = { ...state.curMarker, [prop]: resValue };
      return ({
        curMarker,
      });
    });
  }

  getMarkerPopup() {
    const {
      curMarker,
    } = this.state;
    const { closePopup } = this.props;
    if (!curMarker) {
      return null;
    }
    return (
      <MarkerPopup
        name={curMarker.name}
        lat={curMarker.lat}
        lng={curMarker.lng}
        onChange={this.onMarkerChange}
        onClose={closePopup}
      />
    );
  }

  onMarkerEdit = (e) => {
    const {
      gameModel, translator, closePopup, layerCommunicator,
    } = this.props;
    const marker = e.target;
    gameModel.execute({
      type: 'putBeacon',
      id: marker.options.id,
      props: {
        ...translator.moveFrom(marker.getLatLng()),
      },
    });
    // closePopup();
    layerCommunicator.emit('closePopup');
  // console.log('pm:edit', e.target.getLatLng());
  };

  render() {
    return (
      <>
        {
          this.getMarkerPopup()
        }
      </>
    );
  }
}
