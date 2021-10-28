import React, { Component } from 'react';
import { L, LayersMeta, CommonLayerProps } from "sr2020-mm-client-core";
import * as R from 'ramda';
import './BackgroundImageDisplayLayer.css';

import { 
  getArrDiff, 
  latLngsToBounds, 
  BackgroundImage,
  ArrDiff,
  ArrDiffUpdate
} from 'sr2020-mm-event-engine';

import { 
  bgTitleOverlay,
  BgTitleOverlay,
  bgImageOverlay,
  BgImageOverlay
} from "../../types";
import { processForDisplay } from '../../i18n';

function getTitleLatLngBounds(latlngs: L.LatLngLiteral[][]): L.LatLngBounds {
  const bounds = latLngsToBounds(latlngs[0]);
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

function createTitle(imageData: BackgroundImage) {
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
  // const titleRect = L.svgOverlay(svgElement, svgElementBounds, { id });
  const titleRect = bgTitleOverlay(svgElement, svgElementBounds, { id });
  setTitleText(svgElement, processForDisplay(name));
  return titleRect;
}

function setTitleText(svgElement: SVGElement | undefined, text: string) {
  if(!svgElement) return;
  svgElement.innerHTML = `<text x="0" y="80" class="svg-title-text">${text}</text>`;
}

interface BackgroundImageDisplayLayerProps extends CommonLayerProps {
  imageClassName: string;
  enableByDefault: boolean;
  backgroundImages: BackgroundImage[];
}

export class BackgroundImageDisplayLayer extends Component<BackgroundImageDisplayLayerProps> {
  imageGroup: L.LayerGroup<L.ImageOverlay> = L.layerGroup([]);

  titleGroup = L.layerGroup([]);

  imageGroupNameKey = 'imageGroupLayer';

  titleGroupNameKey = 'titleGroupLayer';

  imagePopupDom: HTMLElement;

  imagePopup: L.Popup;

  constructor(props: BackgroundImageDisplayLayerProps) {
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
    R.map(this.createBackgroundImage, backgroundImages);
    // this.updateBackgroundImages({
    //   added: (backgroundImages),
    // });
    // console.log('BackgroundImageDisplayLayer mounted');
  }

  componentDidUpdate(prevProps: BackgroundImageDisplayLayerProps) {
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
    // console.log('BackgroundImageDisplayLayer did update');
  }

  componentWillUnmount() {
    this.clear();
    // this.communicatorSubscribe('off');
    // console.log('BackgroundImageDisplayLayer will unmount');
  }

  getLayersMeta() {
    return {
      [this.imageGroupNameKey]: this.imageGroup,
      [this.titleGroupNameKey]: this.titleGroup,
    };
  }

  updateBackgroundImages({ added = [], removed = [], updated = [] }: ArrDiff<BackgroundImage>) {
    R.map(this.createBackgroundImage, added);
    R.map(this.updateBackgroundImage, updated);
    R.map(this.removeBackgroundImage, removed);
  }

  clear() {
    this.imageGroup.clearLayers();
    this.titleGroup.clearLayers();
  }

  createBackgroundImage(imageData: BackgroundImage) {
    const { imageClassName = '' } = this.props;
    // const imagesData = gameModel.get('backgroundImages').map(translator.moveTo);

    const {
      latlngs, name, id, image,
    } = imageData;
    const titleRect = createTitle(imageData);
    this.titleGroup.addLayer(titleRect);
    // const imageLayer = L.imageOverlay(image, latlngs, {
    const imageLayer = bgImageOverlay(image, latLngsToBounds(latlngs[0]), {
      id,
      className: imageClassName,
      errorOverlayUrl: 'images/noImage.svg',
    });
    this.imageGroup.addLayer(imageLayer);
  }

  updateBackgroundImage({ item }: ArrDiffUpdate<BackgroundImage>) {
    const {
      latlngs, name, id, image,
    } = item;
    const imageLayer = this.imageGroup.getLayers().find((image2: BgImageOverlay) => image2.options.id === id) as BgImageOverlay;
    imageLayer.setBounds(latLngsToBounds(latlngs[0]));
    imageLayer.setUrl(image);
    const title = this.titleGroup.getLayers().find((title2: BgTitleOverlay) => title2.options.id === id) as BgTitleOverlay;
    setTitleText(title.getElement(), processForDisplay(name));
    title.setBounds(getTitleLatLngBounds(latlngs));
  }

  removeBackgroundImage(imageData: BackgroundImage) {
    const { id } = imageData;
    const image = this.imageGroup.getLayers().find((image2: BgImageOverlay) => image2.options.id === id);
    image && this.imageGroup.removeLayer(image);
    const title = this.titleGroup.getLayers().find((title2: BgTitleOverlay) => title2.options.id === id);
    title && this.titleGroup.removeLayer(title);
  }

  render(): null {
    return null;
  }
}
