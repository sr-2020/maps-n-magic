import React, { Component } from 'react';
import L from 'leaflet/dist/leaflet-src';
import * as R from 'ramda';
import './BackgroundImageLayer2.css';

import { getArrDiff } from 'sr2020-mm-event-engine/utils';
import { BackgroundImagePopup } from '../BackgroundImageLayer/BackgroundImagePopup';

export class BackgroundImageLayer2 extends Component {
  imageGroup = L.layerGroup([]);

  titleGroup = L.layerGroup([]);

  rectangleGroup = L.layerGroup([]);

  imageGroupNameKey = 'imageGroupLayer';

  titleGroupNameKey = 'titleGroupLayer';

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
    // this.updateLocation = this.updateLocation.bind(this);
    // this.removeLocation = this.removeLocation.bind(this);
  }

  componentDidMount() {
    const {
      enableByDefault, layerCommunicator, backgroundImages,
    } = this.props;
    this.imagePopupDom = document.createElement('div');
    // this.subscribe('on', gameModel);
    // this.manaOceanLayer = new InnerManaOceanLayer();
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
    const { editable } = this.props;
    if (editable) {
      return {
        [this.rectangleGroupNameKey]: this.rectangleGroup,
        [this.imageGroupNameKey]: this.imageGroup,
        [this.titleGroupNameKey]: this.titleGroup,
      };
    }
    return {
      // [this.rectangleGroupNameKey]: this.rectangleGroup,
      [this.imageGroupNameKey]: this.imageGroup,
      [this.titleGroupNameKey]: this.titleGroup,
    };
  }

  updateBackgroundImages({ added = [], removed = [], updated = [] }) {
    R.map(this.createBackgroundImage, added);
    // R.map(this.updateLocation, updated);
    R.map(this.removeBackgroundImage, removed);
  }

  clear() {
    this.imageGroup.clearLayers();
    this.titleGroup.clearLayers();
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
    // this.updateImageTooltip(image);
    this.rectangleGroup.addLayer(rectangle);
    const titleRect = this.createTitle(rectangle);
    this.titleGroup.addLayer(titleRect);
    const imageLayer = L.imageOverlay(image, latlngs, {
      id,
      className: imageClassName,
      errorOverlayUrl: 'images/noImage.svg',
    });
    this.imageGroup.addLayer(imageLayer);
    // this.updateLocationsView();

    // const {
    //   polygon, label, id, layer_id, options,
    // } = locationData;
    // const { t, translator } = this.props;
    // // const manaLevel = (id % 5) + 1;
    // // const manaLevel = 5;
    // // const manaLevel = 1;
    // const loc = L.polygon([polygon[0]], {
    //   // id, label, layer_id, color: options.color, weight: options.weight, fillOpacity: options.fillOpacity,
    //   // id, label, layer_id, color: '#2d3748', weight: 2, dashArray: [10], fillColor: manaFillColors[manaLevel], fillOpacity: 1,
    //   id, label, layer_id, color: '#1a202c', weight: 2, dashArray: [7], fillColor: manaFillColors[options.manaLevel], fillOpacity: 1,
    // });
    // loc.on('mouseover', function (e) {
    //   loc.bindTooltip(t('manaGeoLocationTooltip', { name: this.options.label, manaLevel: options.manaLevel }));
    //   this.openTooltip();
    // });
    // loc.on('mouseout', function (e) {
    //   this.closeTooltip();
    // });
    // this.group.addLayer(loc);
  }

  updateBackgroundImage({ item }) {
    const {
      latlngs, name, id, image,
    } = item;
    const rect = this.rectangleGroup.getLayers().find((rect2) => rect2.options.id === id);
    rect.setLatLngs(latlngs);
    L.setOptions(rect, { name, image });
    // this.imageGroup.removeLayer(rect);
    const imageLayer = this.imageGroup.getLayers().find((image2) => image2.options.id === id);
    // this.imageGroup.removeLayer(image);
    imageLayer.setLatLngs(latlngs);
    imageLayer.setUrl(image);
    const title = this.titleGroup.getLayers().find((title2) => title2.options.id === id);
    // this.titleGroup.removeLayer(title);
    // const loc = this.group.getLayers().find((loc2) => loc2.options.id === item.id);
    // loc.setLatLngs([item.polygon[0]]);
    // const { manaLevel } = item.options;
    // loc.setStyle({ fillColor: manaFillColors[manaLevel] });
    // L.setOptions(loc, { label: item.label });
    // loc.on('mouseover', function (e) {
    //   loc.bindTooltip(t('manaGeoLocationTooltip', { name: this.options.label, manaLevel }));
    //   this.openTooltip();
    // });
  }

  removeBackgroundImage(imageData) {
    const { id } = imageData;
    const rect = this.rectangleGroup.getLayers().find((rect2) => rect2.options.id === id);
    this.imageGroup.removeLayer(rect);
    const image = this.imageGroup.getLayers().find((image2) => image2.options.id === id);
    this.imageGroup.removeLayer(image);
    const title = this.titleGroup.getLayers().find((title2) => title2.options.id === id);
    this.titleGroup.removeLayer(title);
  }

  // eslint-disable-next-line class-methods-use-this
  createTitle(rectangle) {
    const { id, name } = rectangle.options;
    const bounds = this.getTitleLatLngBounds(rectangle);
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    // svgElement.setAttribute('viewBox', '0 0 200 200');
    svgElement.setAttribute('viewBox', '0 0 800 100');
    // <rect width="800" height="100" style="fill:white"/>
    // <rect height="100" class="svg-title-rect"/>
    svgElement.innerHTML = `
      <text x="0" y="80" class="svg-title-text">${name}</text>
      `;
    // <rect x="75" y="23" width="50" height="50" style="fill:red"/>
    // <rect x="75" y="123" width="50" height="50" style="fill:#0013ff"/>
    // const svgElementBounds = [[32, -130], [13, -100]];
    const svgElementBounds = bounds;
    const titleRect = L.svgOverlay(svgElement, svgElementBounds, { id });
    return titleRect;

    // const bounds = rectangle.getBounds();
    // const nw = bounds.getNorthWest();
    // const marker = L.marker(nw, { id });
    // // const myIcon = L.divIcon({ className: 'my-div-icon' });
    // const myIcon = L.divIcon({
    //   iconSize: [200, 40],
    //   iconAnchor: [0, 40],
    //   html: name,
    //   // popupAnchor: [1, -34],
    //   // shadowSize: [41, 41],
    // });
    // // marker.setIcon(index % 2 ? myIcon : getIcon('green'));
    // // marker.setIcon(getIcon('green'));
    // marker.setIcon(myIcon);
    // return marker;

    // const bounds = this.getTitleLatLngBounds(rectangle);
    // const titleRect = L.rectangle(bounds, {
    //   id,
    //   interactive: false,
    //   pmIgnore: true,
    //   opacity: 0,
    //   fill: false,
    // });
    // this.updateImageTooltip(titleRect, name);
    // return titleRect;
  }

  // eslint-disable-next-line class-methods-use-this
  getTitleLatLngBounds(rectangle) {
    const bounds = rectangle.getBounds();
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

  communicatorSubscribe(action) {
    const { layerCommunicator, editable } = this.props;
    if (!editable) {
      return;
    }
    layerCommunicator[action]('onCreateLayer', this.onCreateLayer);
    layerCommunicator[action]('onRemoveLayer', this.onRemoveLayer);
  }

  onCreateLayer(event) {
    const { gameModel, translator } = this.props;
    if (event.layer instanceof L.Rectangle) {
      const rect = event.layer;
      console.log('rectangle created');
      // this.imageLayer.onCreateImage(event.layer, gameModel, translator, this.setLocationEventHandlers);
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
    // this.imageLayer.onLocationChange(prop, value, gameModel, id);
    // this.imageLayer.onBackgroundImageChange(prop, value, gameModel, id);

    // const rectangle = this.rectangleGroup.getLayers().find((rect) => rect.options.id === id);
    // if (prop === 'name' || prop === 'manaLevel') {
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
    // this.imageLayer.updateLocationsView();
  }

  // removeLocation(locationData) {
  //   const location = this.group.getLayers().find((loc2) => loc2.options.id === locationData.id);
  //   this.group.removeLayer(location);
  // }

  render() {
    const {
      curBackgroundImage,
    } = this.state;
    if (!curBackgroundImage) {
      return null;
    }
    // return null;
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
}
