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

import { MarkerPopup } from './MarkerPopup';
import { LocationPopup } from './LocationPopup';

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

// R.values(playerTracks).forEach((track, i) => {
//   L.polyline(track, {
//     color: ColorPalette[i % ColorPalette.length].color.border,
//   }).addTo(this.map);
// });

import './Map2.css';

import { UserLayer } from './UserLayer';
import { BotLayer } from './BotLayer';
import { LocationsLayer } from './LocationsLayer';
import { SignalRadiusesLayer } from './SignalRadiusesLayer';
import { VoronoiPolygonsLayer } from './VoronoiPolygonsLayer';
import { BaseContourLayer } from './BaseContourLayer';
import { MarkerLayer } from './MarkerLayer';


// console.log(L);
L.Icon.Default.imagePath = './images/leafletImages/';

export class Map2 extends Component {
  static propTypes = Map2PropTypes;

  constructor(props) {
    super(props);
    this.state = {
      curLocation: null,
      map: null,
    };
    this.onRemoveBeacon = this.onRemoveBeacon.bind(this);
    this.onHighlightLocation_locations = this.onHighlightLocation_locations.bind(this);
    this.onResetHighlightLocation_locations = this.onResetHighlightLocation_locations.bind(this);
    this.getMap = this.getMap.bind(this);
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

    this.subscribe('on', gameModel);
    this.highlightSubscribe('on');

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

    this.locationPopup = L.popup();

    this.locationsLayer = new LocationsLayer();

    this.layerControl = L.control.layers();
    this.layerControl.addTo(this.map);

    this.setLayersMeta(this.locationsLayer.getLayersMeta(), true);

    this.populateMapData();

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

    // Interesting object which can be used to draw position with arrow
    // L.Control.Locate.prototype.options.compassClass

    // this.map.pm.toggleGlobalDragMode();
  }

  componentDidUpdate(prevProps) {
    const {
      curPosition, gameModel, mapConfig,
    } = this.props;
    if (prevProps.gameModel !== gameModel) {
      this.subscribe('off', prevProps.gameModel);
      this.subscribe('on', gameModel);
      this.clearMapData();
      this.populateMapData();
    }
    if (prevProps.curPosition !== curPosition) {
      const { center } = mapConfig;
      this.map.panTo(curPosition || center);
      console.log('position changed');
      this.translator = new Translator(center, curPosition);
      this.clearMapData();
      this.populateMapData();
      this.setState({
        translator: this.translator,
      });
    }
    // console.log('Map2 did update');
  }

  componentWillUnmount() {
    const {
      gameModel,
    } = this.props;
    this.subscribe('off', gameModel);
    this.highlightSubscribe('off');
  }

  // eslint-disable-next-line react/sort-comp
  subscribe(action, gameModel) {
    gameModel[action]('deleteBeacon', this.onRemoveBeacon);
  }

  highlightSubscribe(action) {
    this.layerCommunicator[action]('highlightLocation', this.onHighlightLocation_locations);
    this.layerCommunicator[action]('resetLocationHighlight', this.onResetHighlightLocation_locations);
  }

  getMap() {
    return this.map;
  }

  onCreateLayer = (event) => {
    const { gameModel } = this.props;
    this.layerCommunicator.emit('onCreateLayer', event);
    if (event.layer instanceof L.Marker) {
      // this.markerLayer.onCreateMarker(event.layer, gameModel, this.translator, this.setMarkerEventHandlers);
    } else {
      this.locationsLayer.onCreateLocation(event.layer, gameModel, this.translator, this.setLocationEventHandlers);
    }
  }

  onRemoveLayer = (event) => {
    const { gameModel } = this.props;
    this.layerCommunicator.emit('onRemoveLayer', event);
    if (event.layer instanceof L.Marker) {
      // this.markerLayer.onRemoveMarker(event.layer, gameModel);
    } else {
      this.locationsLayer.onRemoveLocation(event.layer, gameModel);
      this.closePopup();
    }
  }

  onRemoveBeacon({ beacon }) {
    const { gameModel } = this.props;
    this.locationsLayer.removeMarkerFromLocations(beacon.id, gameModel);
    this.locationsLayer.updateLocationsView();
  }

  setLayersMeta(layersMeta, enableByDefault) {
    const { t } = this.props;
    if (enableByDefault) {
      Object.values(layersMeta).forEach((group) => group.addTo(this.map));
    }
    Object.entries(layersMeta).forEach(([nameKey, group]) => {
      this.layerControl.addOverlay(group, t(nameKey));
    });
  }

  populateMapData() {
    const { gameModel, t } = this.props;
    this.locationsLayer.populate(gameModel, this.translator, this.setLocationEventHandlers, t);
  }

  // eslint-disable-next-line react/sort-comp
  clearMapData() {
    this.locationsLayer.clear();
  }

  setLocationEventHandlers = (location) => {
    location.on({
      click: this.onLocationClick,
      mouseover: this.highlightLocation,
      mouseout: this.resetLocationHighlight,
      'pm:edit': this.onLocationEdit,
    });
  }

  onLocationClick = (e) => {
    const {
      name, id, markers, manaLevel,
    } = e.target.options;
    this.setState({
      curLocation: {
        id,
        name,
        markers,
        manaLevel,
      },
    });
    this.locationPopup.setLatLng(e.latlng).setContent(locationPopupDom).openOn(this.map);
  }

  onLocationEdit = (e) => {
    const { gameModel } = this.props;
    const location = e.target;
    gameModel.execute({
      type: 'putLocation',
      id: location.options.id,
      props: {
        ...this.translator.moveFrom({
          latlngs: location.getLatLngs(),
        }),
      },
    });
    this.closePopup();
  }

  highlightLocation = (e) => {
    const layer = e.target;
    this.layerCommunicator.emit('highlightLocation', { location: layer });
  }

  // eslint-disable-next-line camelcase
  onHighlightLocation_locations({ location }) {
    location.setStyle({
      weight: 5,
      color: 'green',
      dashArray: '',
      fillOpacity: 1,
    });
  }

  resetLocationHighlight = () => {
    this.layerCommunicator.emit('resetLocationHighlight');
  }

  onResetHighlightLocation_locations() {
    this.locationsLayer.updateLocationsView();
  }

  onLocMarkerChange = ({ action, markerId }) => {
    const { gameModel } = this.props;
    const locId = this.state.curLocation.id;
    const props = this.locationsLayer.onLocMarkerChange(action, markerId, gameModel, locId);

    this.setState((state) => {
      const curLocation = { ...state.curLocation, markers: props.markers };
      return ({
        curLocation,
      });
    });
  }

  onLocationChange = (prop) => (e) => {
    const { value } = e.target;
    const { gameModel } = this.props;
    const { id } = this.state.curLocation;
    this.locationsLayer.onLocationChange(prop, value, gameModel, id);
    this.setState((state) => {
      const curLocation = { ...state.curLocation, [prop]: value };
      return ({
        curLocation,
      });
    });
    this.locationsLayer.updateLocationsView();
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


  getLocationPopup() {
    const {
      curLocation,
    } = this.state;
    const {
      gameModel,
    } = this.props;
    if (!curLocation) {
      return null;
    }
    const allBeacons = R.clone(gameModel.get('beacons'));
    const allLocations = R.clone(gameModel.get('locations'));
    return (
      <LocationPopup
        name={curLocation.name}
        id={curLocation.id}
        manaLevel={curLocation.manaLevel}
        attachedMarkers={curLocation.markers}
        allBeacons={allBeacons}
        allLocations={allLocations}
        onChange={this.onLocationChange}
        onLocMarkerChange={this.onLocMarkerChange}
        onClose={this.closePopup}
      />
    );
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const { map, translator } = this.state;

    const {
      gameModel,
    } = this.props;

    const layers = map ? (
      <>
        <BaseContourLayer2
          enableByDefault
          setLayersMeta={this.setLayersMeta}
          translator={translator}
        />
        <MarkerLayer2
          enableByDefault
          setLayersMeta={this.setLayersMeta}
          translator={translator}
          gameModel={gameModel}
          getMap={this.getMap}
          closePopup={this.closePopup}
          layerCommunicator={this.layerCommunicator}
        />
        <VoronoiPolygonsLayer2
          gameModel={gameModel}
          // enableByDefault
          setLayersMeta={this.setLayersMeta}
          translator={translator}
        />
        <SignalRadiusesLayer2
          gameModel={gameModel}
          // enableByDefault
          setLayersMeta={this.setLayersMeta}
          translator={translator}
        />
        <BotLayer2
          gameModel={gameModel}
          enableByDefault
          setLayersMeta={this.setLayersMeta}
          translator={translator}
        />
        <UserLayer2
          gameModel={gameModel}
          enableByDefault
          setLayersMeta={this.setLayersMeta}
          translator={translator}
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
        {
          this.getLocationPopup()
        }
        {
          this.getMusicSelect()
        }
      </>
    );
  }
}
