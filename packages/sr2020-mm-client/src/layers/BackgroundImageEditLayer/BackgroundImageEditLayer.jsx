import React, { Component } from 'react';
import L from 'leaflet/dist/leaflet-src';
import * as R from 'ramda';
import './BackgroundImageEditLayer.css';

import { getArrDiff } from 'sr2020-mm-event-engine/utils';
import { BackgroundImagePopup } from '../BackgroundImageLayer/BackgroundImagePopup';

import { BackgroundImageDisplayLayer } from '../BackgroundImageDisplayLayer';

export class BackgroundImageEditLayer extends Component {
  rectangleGroup = L.layerGroup([]);

  rectangleGroupNameKey = 'rectangleGroupLayer';

  constructor(props) {
    super(props);
    this.state = {
      curBackgroundImage: null,
    };
    this.onCreateLayer = this.onCreateLayer.bind(this);
    this.onRemoveLayer = this.onRemoveLayer.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.createBackgroundImage = this.createBackgroundImage.bind(this);
    this.updateBackgroundImage = this.updateBackgroundImage.bind(this);
    this.removeBackgroundImage = this.removeBackgroundImage.bind(this);
  }

  componentDidMount() {
    const {
      enableByDefault, layerCommunicator, backgroundImages,
    } = this.props;
    this.imagePopupDom = document.createElement('div');
    // this.subscribe('on', gameModel);
    this.communicatorSubscribe('on');
    this.imagePopup = L.popup();
    layerCommunicator.emit('setLayersMeta', {
      layersMeta: this.getLayersMeta(),
      enableByDefault,
    });
    this.updateBackgroundImages({
      added: (backgroundImages),
    });
    console.log('InnerManaOceanLayer2 mounted');
  }

  componentDidUpdate(prevProps) {
    const {
      translator, backgroundImages,
    } = this.props;
    if (prevProps.backgroundImages !== backgroundImages) {
      const diff = getArrDiff(
        (backgroundImages),
        (prevProps.backgroundImages),
        R.prop('id'),
      );
      this.updateBackgroundImages(diff);
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
    this.communicatorSubscribe('off');
    console.log('InnerManaOceanLayer2 will unmount');
  }

  getLayersMeta() {
    return {
      [this.rectangleGroupNameKey]: this.rectangleGroup,
    };
  }

  updateBackgroundImages({ added = [], removed = [], updated = [] }) {
    R.map(this.createBackgroundImage, added);
    R.map(this.updateBackgroundImage, updated);
    R.map(this.removeBackgroundImage, removed);
  }

  clear() {
    this.rectangleGroup.clearLayers();
  }

  createBackgroundImage(imageData) {
    const { imageClassName = '' } = this.props;
    // const imagesData = gameModel.get('backgroundImages').map(translator.moveTo);

    const {
      latlngs, name, id, image,
    } = imageData;
    const rectangle = L.rectangle(latlngs, {
      id, name, image,
    });
    rectangle.on({
      click: this.onRectangleClick,
      'pm:edit': this.onRectangleEdit,
    });
    this.rectangleGroup.addLayer(rectangle);
  }

  updateBackgroundImage({ item }) {
    const {
      latlngs, name, id, image,
    } = item;
    const rect = this.rectangleGroup.getLayers().find((rect2) => rect2.options.id === id);
    rect.setLatLngs(latlngs);
    L.setOptions(rect, { name, image });
  }

  removeBackgroundImage(imageData) {
    const { id } = imageData;
    const rect = this.rectangleGroup.getLayers().find((rect2) => rect2.options.id === id);
    this.rectangleGroup.removeLayer(rect);
  }

  communicatorSubscribe(action) {
    const { layerCommunicator } = this.props;
    layerCommunicator[action]('onCreateLayer', this.onCreateLayer);
    layerCommunicator[action]('onRemoveLayer', this.onRemoveLayer);
  }

  onCreateLayer(event) {
    const { gameModel, translator } = this.props;
    if (event.layer instanceof L.Rectangle) {
      const rect = event.layer;
      console.log('rectangle created');
      const latlngs = translator.moveFrom(rect.getLatLngs());
      gameModel.execute({
        type: 'postBackgroundImage',
        props: { latlngs },
      });
      rect.remove();
    }
  }

  onRemoveLayer(event) {
    const {
      gameModel, translator, closePopup, layerCommunicator,
    } = this.props;
    if (event.layer instanceof L.Rectangle) {
      const rect = event.layer;
      // const { id } = rect.options;
      console.log('rectangle removed');
      // this.imageLayer.onRemoveImage(event.layer, gameModel);
      layerCommunicator.emit('closePopup');
      gameModel.execute({
        type: 'deleteBackgroundImage',
        id: rect.options.id,
      });
    }
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
        // ...translator.moveFrom({
        latlngs: rectangle.getLatLngs(),
        // }),
      },
    });
    layerCommunicator.emit('closePopup');
  }

  closePopup() {
    const {
      layerCommunicator,
    } = this.props;
    layerCommunicator.emit('closePopup');
  }

  onBackgroundImageChange = (prop) => (e) => {
    const { value } = e.target;
    const { gameModel } = this.props;
    const { id } = this.state.curBackgroundImage;

    if (prop === 'name' || prop === 'image') {
      // rectangle.options[prop] = value;
      gameModel.execute({
        type: 'putBackgroundImage',
        id,
        props: {
          [prop]: value,
        },
      });
    }

    this.setState((state) => {
      const curBackgroundImage = { ...state.curBackgroundImage, [prop]: value };
      return ({
        curBackgroundImage,
      });
    });
  }

  render() {
    const {
      curBackgroundImage,
    } = this.state;
    return (
      <>
        <BackgroundImageDisplayLayer {...this.props} />
        {
          !!curBackgroundImage
        && (
          <BackgroundImagePopup
            imagePopupDom={this.imagePopupDom}
            name={curBackgroundImage.name}
            id={curBackgroundImage.id}
            image={curBackgroundImage.image}
            onClose={this.closePopup}
            onChange={this.onBackgroundImageChange}
          />
        )
        }
      </>
    );
  }
}
