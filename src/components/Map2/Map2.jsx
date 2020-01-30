// eslint-disable-next-line max-classes-per-file
import React, { Component } from 'react';
import * as R from 'ramda';

import '../../utils/gpxConverter';

import L from 'leaflet/dist/leaflet-src';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

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
      curMarker: null,
      curLocation: null,
    };
    this.onUserPositionUpdate = this.onUserPositionUpdate.bind(this);
    this.onBotUpdate = this.onBotUpdate.bind(this);
    this.onMarkersChange = this.onMarkersChange.bind(this);
    this.updateMarkersView = this.updateMarkersView.bind(this);
  }

  // eslint-disable-next-line max-lines-per-function
  componentDidMount() {
    const {
      curPosition, gameModel, mapConfig,
    } = this.props;
    const { center, zoom } = mapConfig;
    const { urlTemplate, options } = defaultTileLayer;
    this.translator = new Translator(center, curPosition);

    this.subscribe('on', gameModel);

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
    this.initMapBackbone();
    this.populateMapData();

    this.map.on('pm:create', this.onCreateLayer);
    this.map.on('pm:remove', this.onRemoveLayer);

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
    }
    // console.log('Map2 did update');
  }

  componentWillUnmount() {
    const {
      gameModel,
    } = this.props;
    this.subscribe('off', gameModel);
  }

  // eslint-disable-next-line react/sort-comp
  subscribe(action, gameModel) {
    gameModel[action]('botUpdate', this.onBotUpdate);
    gameModel[action]('userPositionUpdate', this.onUserPositionUpdate);
    gameModel[action]('putBeacon', this.onMarkersChange);
    gameModel[action]('postBeacon', this.onMarkersChange);
    gameModel[action]('deleteBeacon', this.onMarkersChange);
    gameModel[action]('putLocation', this.updateMarkersView);
    gameModel[action]('deleteLocation', this.updateMarkersView);
  }

  onUserPositionUpdate(user) {
    this.userLayer.onUserPositionUpdate(user, this.translator);
  }

  onBotUpdate({ bots }) {
    const { t } = this.props;
    this.botLayer.onBotUpdate(bots, t, this.translator);
  }

  onCreateLayer = (event) => {
    const { gameModel } = this.props;
    if (event.layer instanceof L.Marker) {
      this.markerLayer.onCreateMarker(event.layer, gameModel, this.translator, this.setMarkerEventHandlers);
    } else {
      this.locationsLayer.onCreateLocation(event.layer, gameModel, this.translator, this.setLocationEventHandlers);
    }
  }

  onRemoveLayer = (event) => {
    const { gameModel } = this.props;
    if (event.layer instanceof L.Marker) {
      const markerId = event.layer.options.id;
      this.locationsLayer.removeMarkerFromLocations(markerId, gameModel);
      this.locationsLayer.updateLocationsView();
      this.markerLayer.onRemoveMarker(event.layer, gameModel);
    } else {
      this.locationsLayer.onRemoveLocation(event.layer, gameModel);
    }
    this.closeMarkerPopup();
  }

  // eslint-disable-next-line max-lines-per-function
  // eslint-disable-next-line react/sort-comp
  initMapBackbone() {
    this.markerPopup = L.popup();
    this.locationPopup = L.popup();

    this.baseContourLayer = new BaseContourLayer();
    this.markerLayer = new MarkerLayer();
    this.voronoiPolygonsLayer = new VoronoiPolygonsLayer();
    this.signalRadiusesLayer = new SignalRadiusesLayer();
    this.locationsLayer = new LocationsLayer();
    this.botLayer = new BotLayer();
    this.userLayer = new UserLayer();

    const overlayMaps = {
      ...this.setLayersMeta(this.baseContourLayer.getLayersMeta(), true),
      ...this.setLayersMeta(this.markerLayer.getLayersMeta(), true),
      ...this.setLayersMeta(this.voronoiPolygonsLayer.getLayersMeta()),
      ...this.setLayersMeta(this.signalRadiusesLayer.getLayersMeta()),
      ...this.setLayersMeta(this.locationsLayer.getLayersMeta(), true),
      ...this.setLayersMeta(this.botLayer.getLayersMeta(), false),
      ...this.setLayersMeta(this.userLayer.getLayersMeta(), false),
    };

    L.control.layers(null, overlayMaps).addTo(this.map);
  }

  setLayersMeta(layersMeta, enableByDefault) {
    const { t } = this.props;
    if (enableByDefault) {
      Object.values(layersMeta).forEach((group) => group.addTo(this.map));
    }
    return Object.entries(layersMeta).reduce((acc, [nameKey, group]) => {
      acc[t(nameKey)] = group;
      return acc;
    }, {});
  }

  populateMapData() {
    const { gameModel, t } = this.props;
    this.baseContourLayer.populate(this.translator);
    this.markerLayer.populate(gameModel, this.translator, t, this.setMarkerEventHandlers);
    this.locationsLayer.populate(gameModel, this.translator, this.setLocationEventHandlers, t);
    this.signalRadiusesLayer.populate(gameModel, this.translator);
    this.voronoiPolygonsLayer.populate(gameModel, this.translator);
  }

  // eslint-disable-next-line react/sort-comp
  clearMapData() {
    this.baseContourLayer.clear();
    this.markerLayer.clear();
    this.locationsLayer.clear();
    this.signalRadiusesLayer.clear();
    this.voronoiPolygonsLayer.clear();
  }

  setMarkerEventHandlers = (marker) => {
    marker.on({
      click: (e) => {
        this.setState({
          curMarker: {
            lat: e.target.getLatLng().lat,
            lng: e.target.getLatLng().lng,
            name: e.target.options.name,
            id: e.target.options.id,
          },
        });
        this.markerPopup.setLatLng(e.latlng).setContent(markerPopupDom).openOn(this.map);
      },
      'pm:edit': this.onMarkerEdit,
    });
  }

  updateMarkersView() {
    const { gameModel } = this.props;
    this.markerLayer.updateMarkersView(gameModel);
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
    this.closeMarkerPopup();
  }

  highlightLocation = (e) => {
    const layer = e.target;

    layer.setStyle({
      weight: 5,
      color: 'green',
      dashArray: '',
      fillOpacity: 1,
    });

    // this is a communication between layers
    // need to add connector for such case
    const { markers } = layer.options;
    this.markerLayer.highlightMarkers(markers);
  }

  resetLocationHighlight = () => {
    this.locationsLayer.updateLocationsView();
    // this is a communication between layers
    // need to add connector for such case
    this.updateMarkersView();
  }

  // eslint-disable-next-line react/sort-comp
  onMarkersChange() {
    const { gameModel } = this.props;
    this.signalRadiusesLayer.updateSignalRadiuses(gameModel, this.translator);
    this.voronoiPolygonsLayer.updateVoronoiPolygons(gameModel, this.translator);
  }

  onMarkerEdit = (e) => {
    const { gameModel } = this.props;
    const marker = e.target;
    gameModel.execute({
      type: 'putBeacon',
      id: marker.options.id,
      props: {
        ...this.translator.moveFrom(marker.getLatLng()),
      },
    });
    this.closeMarkerPopup();
    // console.log('pm:edit', e.target.getLatLng());
  };

  onMarkerChange = (prop) => (e) => {
    const { value } = e.target;
    const { gameModel } = this.props;
    const { id } = this.state.curMarker;
    const resValue = this.markerLayer.onMarkerChange(prop, value, gameModel, id);
    this.setState((state) => {
      const curMarker = { ...state.curMarker, [prop]: resValue };
      return ({
        curMarker,
      });
    });
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

  closeMarkerPopup = () => {
    this.map.closePopup();
  }

  getMarkerPopup() {
    const {
      curMarker,
    } = this.state;
    if (!curMarker) {
      return null;
    }
    return (
      <MarkerPopup
        name={curMarker.name}
        lat={curMarker.lat}
        lng={curMarker.lng}
        onChange={this.onMarkerChange}
        onClose={this.closeMarkerPopup}
      />
    );
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
    // const allBeacons = R.clone(gameModel.getBeacons());
    // const allLocations = R.clone(gameModel.getLocations());
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
        onClose={this.closeMarkerPopup}
      />
    );
  }

  render() {
    return (
      <>
        <div
          className="Map2 h-full"
          ref={(map) => (this.mapEl = map)}
        />
        {
          this.getMarkerPopup()
        }
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
