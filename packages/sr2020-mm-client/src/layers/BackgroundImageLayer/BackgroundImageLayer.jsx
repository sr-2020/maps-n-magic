import React, { Component } from 'react';
import './BackgroundImageLayer.css';

import L from 'leaflet/dist/leaflet-src';
import * as R from 'ramda';

import { InnerBackgroundImageLayer } from './InnerBackgroundImageLayer';
import { BackgroundImagePopup } from '../BackgroundImageEditLayer/BackgroundImagePopup';

// import { BackgroundImageLayerPropTypes } from '../../types';

export class BackgroundImageLayer extends Component {
  // static propTypes = BackgroundImageLayerPropTypes;

  constructor(props) {
    super(props);
    this.state = {
      curBackgroundImage: null,
    };
    this.onCreateLayer = this.onCreateLayer.bind(this);
    this.onRemoveLayer = this.onRemoveLayer.bind(this);
    this.setRectangleEventHandlers = this.setRectangleEventHandlers.bind(this);
    this.onRectangleEdit = this.onRectangleEdit.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.onPutBackgroundImage = this.onPutBackgroundImage.bind(this);
  }

  componentDidMount() {
    const {
      gameModel, enableByDefault, layerCommunicator, editable, imageClassName,
    } = this.props;
    this.imagePopupDom = document.createElement('div');
    this.subscribe('on', gameModel);
    this.communicatorSubscribe('on');
    this.imagePopup = L.popup();
    this.imageLayer = new InnerBackgroundImageLayer(imageClassName);
    layerCommunicator.emit('setLayersMeta', {
      layersMeta: this.imageLayer.getLayersMeta(editable),
      enableByDefault,
    });
    this.populate();
    console.log('BackgroundImageLayer mounted');
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
    console.log('BackgroundImageLayer did update');
  }

  componentWillUnmount() {
    const {
      gameModel,
    } = this.props;
    this.subscribe('off', gameModel);
    this.communicatorSubscribe('off');
    // while (this.imagePopupDom.firstChild) {
    //   this.imagePopupDom.removeChild(this.imagePopupDom.lastChild);
    // }
    // this.clear();
    console.log('BackgroundImageLayer will unmount');
  }

  // eslint-disable-next-line react/sort-comp
  populate() {
    const {
      gameModel, t, translator,
    } = this.props;
      // this.imageLayer.populate(gameModel, translator, t, this.setMarkerEventHandlers);
    // this.imageLayer.populate(gameModel, translator, this.setLocationEventHandlers, t);
    this.imageLayer.populate(gameModel, translator, this.setRectangleEventHandlers);
  }

  clear() {
    this.imageLayer.clear();
  }

  subscribe(action, gameModel) {
    gameModel[action]('putBackgroundImage', this.onPutBackgroundImage);
  }

  communicatorSubscribe(action) {
    const { layerCommunicator, editable } = this.props;
    if (!editable) {
      return;
    }
    // layerCommunicator[action]('highlightLocation', this.onHighlightLocation_locations);
    // layerCommunicator[action]('resetLocationHighlight', this.onResetHighlightLocation_locations);
    layerCommunicator[action]('onCreateLayer', this.onCreateLayer);
    layerCommunicator[action]('onRemoveLayer', this.onRemoveLayer);
  }

  onCreateLayer(event) {
    const { gameModel, translator } = this.props;
    if (event.layer instanceof L.Rectangle) {
      console.log('rectangle created');
      // this.imageLayer.onCreateImage(event.layer, gameModel, translator, this.setLocationEventHandlers);
      this.imageLayer.onCreateImage(event.layer, gameModel, translator, this.setRectangleEventHandlers);
    }
  }

  onRemoveLayer(event) {
    const {
      gameModel, translator, closePopup, layerCommunicator,
    } = this.props;
    if (event.layer instanceof L.Rectangle) {
      console.log('rectangle removed');
      // this.markerLayer.onRemoveMarker(event.layer, gameModel, translator, this.setMarkerEventHandlers);
      // this.imageLayer.onRemoveLocation(event.layer, gameModel);
      this.imageLayer.onRemoveImage(event.layer, gameModel);
      layerCommunicator.emit('closePopup');
    }
  }

  onPutBackgroundImage({ backgroundImage }) {
    this.imageLayer.onPutBackgroundImage({ backgroundImage });
  }

  setRectangleEventHandlers = (rect) => {
    rect.on({
      click: this.onRectangleClick,
      // mouseover: this.highlightLocation,
      // mouseout: this.resetLocationHighlight,
      'pm:edit': this.onRectangleEdit,
    });
  }

  onRectangleClick = (e) => {
    const { layerCommunicator } = this.props;
    const {
      name, id, image,
    } = e.target.options;
    this.setState({
      curBackgroundImage: {
        id,
        name,
        image,
      },
    });
    layerCommunicator.emit('openPopup', {
      popup: this.imagePopup.setLatLng(e.latlng).setContent(this.imagePopupDom),
    });
  }

  onRectangleEdit = (e) => {
    const {
      gameModel, translator, closePopup, layerCommunicator,
    } = this.props;
    const rectangle = e.target;
    gameModel.execute({
      type: 'putBackgroundImage',
      id: rectangle.options.id,
      props: {
        ...translator.moveFrom({
          latlngs: rectangle.getLatLngs(),
        }),
      },
    });
    layerCommunicator.emit('closePopup');
  }

  onBackgroundImageChange = (prop) => (e) => {
    const { value } = e.target;
    const { gameModel } = this.props;
    const { id } = this.state.curBackgroundImage;
    // this.imageLayer.onLocationChange(prop, value, gameModel, id);
    this.imageLayer.onBackgroundImageChange(prop, value, gameModel, id);
    this.setState((state) => {
      const curBackgroundImage = { ...state.curBackgroundImage, [prop]: value };
      return ({
        curBackgroundImage,
      });
    });
    // this.imageLayer.updateLocationsView();
  }

  // eslint-disable-next-line class-methods-use-this
  closePopup() {
    const {
      layerCommunicator,
    } = this.props;
    layerCommunicator.emit('closePopup');
  }

  getRectanglePopup() {
    // return null;
    const {
      curBackgroundImage,
    } = this.state;
    const {
      gameModel,
    } = this.props;
    if (!curBackgroundImage) {
      return null;
    }
    return (
      <BackgroundImagePopup
        imagePopupDom={this.imagePopupDom}
        name={curBackgroundImage.name}
        id={curBackgroundImage.id}
        image={curBackgroundImage.image}
        onClose={this.closePopup}
        onChange={this.onBackgroundImageChange}
      />
    );
  }

  render() {
    return (
      <>
        {
          this.getRectanglePopup()
        }
      </>
    );
  }
}
