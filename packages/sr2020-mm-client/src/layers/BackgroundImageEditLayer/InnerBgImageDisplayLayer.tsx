import React, { Component } from 'react';
import { L, LayersMeta, CommonLayerProps } from "sr2020-mm-client-core";
import * as R from 'ramda';
import './BackgroundImageEditLayer.css';

import { getArrDiff, BackgroundImage, ArrDiff, ArrDiffUpdate } from 'sr2020-mm-event-engine';

import { 
  bgRectangle,
  BgRectangle
} from "../../types";

interface BackgroundImageEditLayerProps extends CommonLayerProps{
  enableByDefault: boolean;
  backgroundImages: BackgroundImage[];
  onRectangleClick: L.LeafletEventHandlerFn;
  onRectangleEdit: L.LeafletEventHandlerFn;
}

export class InnerBgImageDisplayLayer extends Component<
  BackgroundImageEditLayerProps
> {
  rectangleGroup = L.layerGroup([]);

  rectangleGroupNameKey = 'rectangleGroupLayer';

  constructor(props: BackgroundImageEditLayerProps) {
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
    R.map(this.createBackgroundImage, backgroundImages);
    // this.updateBackgroundImages({
    //   added: (backgroundImages),
    // });
    console.log('InnerManaOceanLayer2 mounted');
  }

  componentDidUpdate(prevProps: BackgroundImageEditLayerProps) {
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

  updateBackgroundImages({ added = [], removed = [], updated = [] }: ArrDiff<BackgroundImage>) {
    R.map(this.createBackgroundImage, added);
    R.map(this.updateBackgroundImage, updated);
    R.map(this.removeBackgroundImage, removed);
  }

  clear() {
    this.rectangleGroup.clearLayers();
  }

  createBackgroundImage(imageData: BackgroundImage) {
    // const { imageClassName = '' } = this.props;
    const { onRectangleClick, onRectangleEdit } = this.props;
    // const imagesData = gameModel.get('backgroundImages').map(translator.moveTo);

    const {
      latlngs, name, id, image,
    } = imageData;
    // const rectangle = L.rectangle(latlngs, {
    // TODO fix type cast
    const rectangle = bgRectangle(latlngs as any, {
      id, name, image,
    });
    rectangle.on('click', onRectangleClick);
    rectangle.on('pm:edit', onRectangleEdit);
    this.rectangleGroup.addLayer(rectangle);
  }

  updateBackgroundImage({ item }: ArrDiffUpdate<BackgroundImage>) {
    const {
      latlngs, name, id, image,
    } = item;
    const rect = this.rectangleGroup.getLayers().find((rect2: BgRectangle) => rect2.options.id === id) as BgRectangle;
    rect.setLatLngs(latlngs);
    L.Util.setOptions(rect, { name, image });
  }

  removeBackgroundImage(imageData: BackgroundImage) {
    const { id } = imageData;
    const rect = this.rectangleGroup.getLayers().find((rect2: BgRectangle) => rect2.options.id === id);
    this.rectangleGroup.removeLayer(rect);
  }

  render(): null {
    return null;
  }
}
