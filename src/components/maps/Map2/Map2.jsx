// eslint-disable-next-line max-classes-per-file
import React, { Component } from 'react';
import * as R from 'ramda';

import '../../../utils/gpxConverter';

import L from 'leaflet/dist/leaflet-src';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

import { EventEmitter } from 'events';

import { Map2PropTypes } from '../../../types';

import { geomanConfig, defaultTileLayer } from '../../../configs/map';

import { markerPopupDom, locationPopupDom, musicSelectDom } from '../../../utils/domUtils';

import { applyLeafletGeomanTranslation, getZoomTranslation } from '../../../translations';

import { SoundStageEcho } from '../../SoundManager/SoundStageEcho';

// eslint-disable-next-line import/extensions
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.js';
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css';

import './Map2.css';

// console.log(L);
L.Icon.Default.imagePath = './images/leafletImages/';

export class Map2 extends Component {
  static propTypes = Map2PropTypes;

  constructor(props) {
    super(props);
    this.state = {
      map: null,
    };
    this.openPopup = this.openPopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.setLayersMeta = this.setLayersMeta.bind(this);
  }

  // eslint-disable-next-line max-lines-per-function
  componentDidMount() {
    const {
      mapConfig,
    } = this.props;
    const { center, zoom } = mapConfig;
    const { urlTemplate, options } = defaultTileLayer;

    this.layerCommunicator = new EventEmitter();

    this.map = L.map(this.mapEl, {
      center,
      zoom,
      zoomControl: false,
    });
    // Svg image proof of concept
    // // const imageUrl = 'images/test.svg';
    // // const imageUrl = 'images/sr2020_base_map1.svg';
    // const imageUrl = 'images/sr2020_base_map2.svg';
    // const width = 976;
    // const height = 578;

    // // (y1 - y2) / height = (x2 - x1) / width
    // const y1 = 54.930300122616605;
    // const x1 = 36.86880692955018;
    // const y2 = 54.926889453719246;
    // const x2 = 36.87855139322438;
    // // const x2 = ((y1 - y2) / height) * width + x1;
    // const imageBounds = [
    //   [y1, x1],
    //   [y2, x2],
    // ];
    // // const imageBounds = [
    // //   [54.93064336, 36.868368075],
    // //   [54.92720824, 36.874747825]
    // // ];
    // L.imageOverlay(imageUrl, imageBounds).addTo(this.map);

    L.control.zoom({
      ...getZoomTranslation(),
      position: 'topleft',
    }).addTo(this.map);
    L.tileLayer(urlTemplate, options).addTo(this.map);

    this.layerControl = L.control.layers();
    this.layerControl.addTo(this.map);

    this.map.pm.addControls(geomanConfig);
    applyLeafletGeomanTranslation(this.map);
    // applyZoomTranslation(this.map);

    this.map.on('pm:create', this.onCreateLayer);
    this.map.on('pm:remove', this.onRemoveLayer);

    // TODO extract as debug control?
    const legend = L.control({ position: 'bottomleft' });
    // const legend = L.control({ position: 'topright' });
    legend.onAdd = function (map) {
      return musicSelectDom;
    };
    L.DomEvent.on(musicSelectDom, 'dblclick', (ev) => {
      L.DomEvent.stopPropagation(ev);
    });
    L.DomEvent.disableScrollPropagation(musicSelectDom);

    legend.addTo(this.map);

    this.setState({
      map: this.map,
    });

    this.communicatorSubscribe('on');

    // Interesting object which can be used to draw position with arrow
    // L.Control.Locate.prototype.options.compassClass

    // this.map.pm.toggleGlobalDragMode();
  }

  componentDidUpdate(prevProps) {
    const {
      curPosition, mapConfig,
    } = this.props;
    if (prevProps.curPosition !== curPosition) {
      const { center } = mapConfig;
      this.map.panTo(curPosition || center);
      console.log('position changed');
    }
    // console.log('Map2 did update');
  }

  componentWillUnmount() {
    this.communicatorSubscribe('off');
  }

  communicatorSubscribe(action) {
    this.layerCommunicator[action]('openPopup', this.openPopup);
    this.layerCommunicator[action]('closePopup', this.closePopup);
    this.layerCommunicator[action]('setLayersMeta', this.setLayersMeta);
  }

  onCreateLayer = (event) => {
    this.layerCommunicator.emit('onCreateLayer', event);
  }

  onRemoveLayer = (event) => {
    this.layerCommunicator.emit('onRemoveLayer', event);
  }

  setLayersMeta({ layersMeta, enableByDefault }) {
    const { t } = this.props;
    if (enableByDefault) {
      Object.values(layersMeta).forEach((group) => group.addTo(this.map));
    }
    Object.entries(layersMeta).forEach(([nameKey, group]) => {
      this.layerControl.addOverlay(group, t(nameKey));
    });
  }

  openPopup({ popup }) {
    popup.openOn(this.map);
  }

  closePopup() {
    this.map.closePopup();
  }

  // getMusicSelect = () => null
  getMusicSelect() {
    const {
      gameModel,
    } = this.props;
    // if (!curMarker) {
    //   return null;
    // }
    return (
      <SoundStageEcho gameModel={gameModel} />
      // <MusicSelect gameModel={gameModel} />
    );
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const { map } = this.state;

    const {
      render,
    } = this.props;

    const mapProps = {
      layerCommunicator: this.layerCommunicator,
    };

    return (
      <>
        <div
          className="Map2 h-full"
          ref={(map2) => (this.mapEl = map2)}
        />
        {map && render(mapProps)}
        {
          this.getMusicSelect()
        }
      </>
    );
  }
}
