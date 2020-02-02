// eslint-disable-next-line max-classes-per-file
import React, { Component } from 'react';
import * as R from 'ramda';

import '../../utils/gpxConverter';

import L from 'leaflet/dist/leaflet-src';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

import { EventEmitter } from 'events';

import { Map2PropTypes } from '../../types';

import { geomanConfig, defaultTileLayer } from '../../configs/map';

import { markerPopupDom, locationPopupDom, musicSelectDom } from '../../utils/domUtils';

import { applyLeafletGeomanTranslation, getZoomTranslation } from '../../translations';

import { SoundStageEcho } from '../SoundManager/SoundStageEcho';

import { Translator } from './Translator';

// eslint-disable-next-line import/extensions
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.js';
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css';

// import playerTracks from '../../data/initialPlayerTracks';
import { MusicSelect } from './MusicSelect';

import { BotLayer2 } from './BotLayer2';
import { UserLayer2 } from './UserLayer2';
import { SignalRadiusesLayer2 } from './SignalRadiusesLayer2';
import { VoronoiPolygonsLayer2 } from './VoronoiPolygonsLayer2';
import { BaseContourLayer2 } from './BaseContourLayer2';
import { MarkerLayer2 } from './MarkerLayer2';
import { LocationLayer2 } from './LocationLayer2';

// R.values(playerTracks).forEach((track, i) => {
//   L.polyline(track, {
//     color: ColorPalette[i % ColorPalette.length].color.border,
//   }).addTo(this.map);
// });

import './Map2.css';

// console.log(L);
L.Icon.Default.imagePath = './images/leafletImages/';

export class Map2 extends Component {
  static propTypes = Map2PropTypes;

  constructor(props) {
    super(props);
    this.state = {
      translator: null,
      map: null,
    };
    this.openPopup = this.openPopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.setLayersMeta = this.setLayersMeta.bind(this);
  }

  // eslint-disable-next-line max-lines-per-function
  componentDidMount() {
    const {
      curPosition, gameModel, mapConfig,
    } = this.props;
    const { center, zoom } = mapConfig;
    const { urlTemplate, options } = defaultTileLayer;

    this.layerCommunicator = new EventEmitter();

    this.translator = new Translator(center, curPosition);

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
    this.map.pm.addControls(geomanConfig);
    applyLeafletGeomanTranslation(this.map);
    // applyZoomTranslation(this.map);

    this.layerControl = L.control.layers();
    this.layerControl.addTo(this.map);

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
      translator: this.translator,
    });

    this.communicatorSubscribe('on');

    // Interesting object which can be used to draw position with arrow
    // L.Control.Locate.prototype.options.compassClass

    // this.map.pm.toggleGlobalDragMode();
  }

  componentDidUpdate(prevProps) {
    const {
      curPosition, gameModel, mapConfig,
    } = this.props;
    if (prevProps.curPosition !== curPosition) {
      const { center } = mapConfig;
      this.map.panTo(curPosition || center);
      console.log('position changed');
      this.translator = new Translator(center, curPosition);
      this.setState({
        translator: this.translator,
      });
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
    const { map, translator } = this.state;

    const {
      gameModel,
    } = this.props;

    const mapProps = {
      translator,
      layerCommunicator: this.layerCommunicator,
    };

    const layers = map ? (
      <>
        <BaseContourLayer2
          enableByDefault
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...mapProps}
        />
        <MarkerLayer2
          enableByDefault
          gameModel={gameModel}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...mapProps}
        />
        <LocationLayer2
          enableByDefault
          gameModel={gameModel}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...mapProps}
        />
        <VoronoiPolygonsLayer2
          gameModel={gameModel}
          // enableByDefault
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...mapProps}
        />
        <SignalRadiusesLayer2
          gameModel={gameModel}
          // enableByDefault
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...mapProps}
        />
        <BotLayer2
          gameModel={gameModel}
          enableByDefault
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...mapProps}
        />
        <UserLayer2
          gameModel={gameModel}
          enableByDefault
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...mapProps}
        />
      </>
    ) : null;
    return (
      <>
        <div
          className="Map2 h-full"
          ref={(map2) => (this.mapEl = map2)}
        />
        {layers}
        {/* {
          this.getLocationPopup()
        } */}
        {
          this.getMusicSelect()
        }
      </>
    );
  }
}
