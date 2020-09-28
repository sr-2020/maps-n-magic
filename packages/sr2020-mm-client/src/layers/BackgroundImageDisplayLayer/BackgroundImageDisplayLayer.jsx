import React, { Component } from 'react';
import L from 'leaflet/dist/leaflet-src';
import * as R from 'ramda';
import './BackgroundImageDisplayLayer.css';

import { getArrDiff, latLngsToBounds } from 'sr2020-mm-event-engine/utils';

function getTitleLatLngBounds(latlngs) {
  const bounds = latLngsToBounds(latlngs);
  const nw = bounds.getNorthWest();
  const ne = L.latLng({
    // lat: nw.lat + 0.0005 / 2,
    // lng: nw.lng + 0.0001,
    lat: nw.lat + 0.0005 / 2,
    lng: nw.lng + 0.0032,
    // lng: nw.lng + 0.01,
    // lng: nw.lng,
  });
  return L.latLngBounds(nw, ne);
}

function createTitle(imageData) {
  const { id, name, latlngs } = imageData;
  const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  // svgElement.setAttribute('viewBox', '0 0 200 200');
  svgElement.setAttribute('viewBox', '0 0 800 100');
  // <rect width="800" height="100" style="fill:white"/>
  // <rect height="100" class="svg-title-rect"/>
  // svgElement.innerHTML = `
  //   <text x="0" y="80" class="svg-title-text">${name}</text>
  //   `;
  // <rect x="75" y="23" width="50" height="50" style="fill:red"/>
  // <rect x="75" y="123" width="50" height="50" style="fill:#0013ff"/>
  // const svgElementBounds = [[32, -130], [13, -100]];
  const svgElementBounds = getTitleLatLngBounds(latlngs);
  const titleRect = L.svgOverlay(svgElement, svgElementBounds, { id });
  setTitleText(svgElement, name);
  return titleRect;
}

function setTitleText(svgElement, text) {
  svgElement.innerHTML = `<text x="0" y="80" class="svg-title-text">${text}</text>`;
}

export class BackgroundImageDisplayLayer extends Component {
  imageGroup = L.layerGroup([]);

  titleGroup = L.layerGroup([]);

  imageGroupNameKey = 'imageGroupLayer';

  titleGroupNameKey = 'titleGroupLayer';

  constructor(props) {
    super(props);
    this.state = {
      // curBackgroundImage: null,
    };
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
    // this.communicatorSubscribe('on');
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
    // this.communicatorSubscribe('off');
    console.log('InnerManaOceanLayer2 will unmount');
  }

  getLayersMeta() {
    return {
      [this.imageGroupNameKey]: this.imageGroup,
      [this.titleGroupNameKey]: this.titleGroup,
    };
  }

  updateBackgroundImages({ added = [], removed = [], updated = [] }) {
    R.map(this.createBackgroundImage, added);
    R.map(this.updateBackgroundImage, updated);
    R.map(this.removeBackgroundImage, removed);
  }

  clear() {
    this.imageGroup.clearLayers();
    this.titleGroup.clearLayers();
  }

  createBackgroundImage(imageData) {
    const { imageClassName = '' } = this.props;
    // const imagesData = gameModel.get('backgroundImages').map(translator.moveTo);

    const {
      latlngs, name, id, image,
    } = imageData;
    const titleRect = createTitle(imageData);
    this.titleGroup.addLayer(titleRect);
    const imageLayer = L.imageOverlay(image, latlngs, {
      id,
      className: imageClassName,
      errorOverlayUrl: 'images/noImage.svg',
    });
    this.imageGroup.addLayer(imageLayer);
  }

  updateBackgroundImage({ item }) {
    const {
      latlngs, name, id, image,
    } = item;
    const imageLayer = this.imageGroup.getLayers().find((image2) => image2.options.id === id);
    imageLayer.setBounds(latlngs);
    imageLayer.setUrl(image);
    const title = this.titleGroup.getLayers().find((title2) => title2.options.id === id);
    setTitleText(title.getElement(), name);
    title.setBounds(getTitleLatLngBounds(latlngs));
  }

  removeBackgroundImage(imageData) {
    const { id } = imageData;
    const image = this.imageGroup.getLayers().find((image2) => image2.options.id === id);
    this.imageGroup.removeLayer(image);
    const title = this.titleGroup.getLayers().find((title2) => title2.options.id === id);
    this.titleGroup.removeLayer(title);
  }

  render() {
    return null;
  }
}
