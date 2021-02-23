import React, { Component } from 'react';
import { L } from "sr2020-mm-client-core/leafletWrapper";
import * as R from 'ramda';
import './BackgroundImageEditLayer.css';

import { getArrDiff } from 'sr2020-mm-event-engine';

export class InnerBgImageDisplayLayer extends Component {
  rectangleGroup = L.layerGroup([]);

  rectangleGroupNameKey = 'rectangleGroupLayer';

  constructor(props) {
    super(props);
    this.state = {
    };
    this.createBackgroundImage = this.createBackgroundImage.bind(this);
    this.updateBackgroundImage = this.updateBackgroundImage.bind(this);
    this.removeBackgroundImage = this.removeBackgroundImage.bind(this);
  }

  componentDidMount() {
    const {
      enableByDefault, layerCommunicator, backgroundImages,
    } = this.props;
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
    // this.communicatorSubscribe('off');
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
    // const { imageClassName = '' } = this.props;
    const { onRectangleClick, onRectangleEdit } = this.props;
    // const imagesData = gameModel.get('backgroundImages').map(translator.moveTo);

    const {
      latlngs, name, id, image,
    } = imageData;
    const rectangle = L.rectangle(latlngs, {
      id, name, image,
    });
    rectangle.on({
      click: onRectangleClick,
      'pm:edit': onRectangleEdit,
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

  render() {
    return null;
  }
}
