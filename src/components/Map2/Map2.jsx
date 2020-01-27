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

import { baseClosedLLs, baseLLs } from '../../data/baseContours';


import { getIcon } from '../../utils/icons';

import { COLOR_PALETTE } from '../../utils/colorPalette';

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
  }

  // eslint-disable-next-line max-lines-per-function
  componentDidMount = () => {
    const {
      curPosition, gameModel, mapConfig,
    } = this.props;
    const { center, zoom } = mapConfig;
    const { urlTemplate, options } = defaultTileLayer;
    this.translator = new Translator(center, curPosition);

    gameModel.on('botUpdate', this.onBotUpdate);
    gameModel.on('userPositionUpdate', this.onUserPositionUpdate);

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

  componentDidUpdate = (prevProps) => {
    if (prevProps.gameModel !== this.props.gameModel) {
      this.clearMapData();
      this.populateMapData();
    }
    if (prevProps.curPosition !== this.props.curPosition) {
      const { center } = this.props.mapConfig;
      this.map.panTo(this.props.curPosition || center);
      console.log('position changed');
      this.translator = new Translator(center, this.props.curPosition);
      this.clearMapData();
      this.populateMapData();
      // this.props.soundService.stopAllSounds();
    }
    // console.log('Map2 did update');
  }

  componentWillUnmount = () => {
    this.props.gameModel.off('botUpdate', this.onBotUpdate);
    this.props.gameModel.off('userPositionUpdate', this.onUserPositionUpdate);
  }

  onUserPositionUpdate(user) {
    this.userLayer.onUserPositionUpdate(user, this.translator);
  }

  onBotUpdate({ bots }) {
    const { t } = this.props;
    this.botLayer.onBotUpdate(bots, t, this.translator);
  }

  onCreateLayer = (event) => {
    if (event.layer instanceof L.Marker) {
      this.onCreateMarker(event.layer);
    } else {
      const { gameModel } = this.props;
      this.locationsLayer.onCreateLocation(event.layer, gameModel, this.translator, this.setLocationEventHandlers);
    }
  }

  onCreateMarker = (marker) => {
    const { gameModel } = this.props;
    const latlng = this.translator.moveFrom(marker.getLatLng());
    // const { id, name } = gameModel.postBeacon(latlng);
    const { id, name } = gameModel.execute({
      type: 'postBeacon',
      props: { ...latlng },
    });
    L.setOptions(marker, { id, name });
    this.markerGroup.addLayer(marker);

    this.setMarkerEventHandlers(marker);
    this.onMarkersChange();
    this.updateMarkersView();
  }

  onRemoveLayer = (event) => {
    const { gameModel } = this.props;
    if (event.layer instanceof L.Marker) {
      const markerId = event.layer.options.id;
      this.locationsLayer.removeMarkerFromLocations(markerId, gameModel);
      // this.updateLocationsView();
      this.locationsLayer.updateLocationsView();
      this.markerGroup.removeLayer(event.layer);
      this.onMarkersChange();
      // gameModel.deleteBeacon(event.layer.options.id);
      gameModel.execute({
        type: 'deleteBeacon',
        id: event.layer.options.id,
      });
    } else {
      this.locationsLayer.onRemoveLocation(event.layer, gameModel);
      this.updateMarkersView();
    }
    this.closeMarkerPopup();
  }

  // eslint-disable-next-line max-lines-per-function
  initMapBackbone = () => {
    const { t } = this.props;
    this.markerPopup = L.popup();
    this.locationPopup = L.popup();

    this.baseContourGroup = L.layerGroup([]);
    this.polygonsGroup = L.layerGroup([]);
    this.massCentersGroup = L.layerGroup([]);
    this.signalRadiusesGroup = L.layerGroup([]);
    this.markerGroup = L.layerGroup([]);
    this.locationsLayer = new LocationsLayer();
    // this.locationsGroup = L.layerGroup([]);
    // this.locationsGroup = this.locationsLayer.getGroup();
    // this.botTrackGroup = L.layerGroup([]);
    // this.botGroup = L.layerGroup([]);
    this.botLayer = new BotLayer();
    // this.userGroup = L.layerGroup([]);
    this.userLayer = new UserLayer();

    this.baseContourGroup.addTo(this.map);
    // polygonsGroup.addTo(this.map);
    // massCentersGroup.addTo(this.map);
    // this.signalRadiusesGroup.addTo(this.map);
    // this.markerGroup.addTo(this.map);
    // this.locationsGroup.addTo(this.map);
    this.locationsLayer.getGroup().addTo(this.map);
    // this.botTrackGroup.addTo(this.map);
    // this.botGroup.addTo(this.map);
    this.botLayer.getBotGroup().addTo(this.map);
    this.botLayer.getBotTrackGroup().addTo(this.map);
    // this.userGroup.addTo(this.map);
    this.userLayer.getGroup().addTo(this.map);

    const overlayMaps = {
      [t('baseContourLayer')]: this.baseContourGroup,
      [t('beaconsLayer')]: this.markerGroup,
      [t('massCentersLayer')]: this.massCentersGroup,
      [t('voronoiPolygonsLayer')]: this.polygonsGroup,
      [t('signalRadiusesLayer')]: this.signalRadiusesGroup,
      // [t('locationsLayer')]: this.locationsGroup,
      [t(this.locationsLayer.getNameKey())]: this.locationsLayer.getGroup(),
      // [t('botTrackLayer')]: this.botTrackGroup,
      // [t('botLayer')]: this.botGroup,
      [t(this.botLayer.getBotGroupKey())]: this.botLayer.getBotGroup(),
      [t(this.botLayer.getBotTrackGroupKey())]: this.botLayer.getBotTrackGroup(),
      // [t('userLayer')]: this.userGroup,
      [t(this.userLayer.getNameKey())]: this.userLayer.getGroup(),
    };

    L.control.layers(null, overlayMaps).addTo(this.map);
  }

  populateMapData = () => {
    const { gameModel, t } = this.props;

    const baseLine = L.polyline(this.translator.moveTo(baseLLs), {
      color: 'green',
      pmIgnore: true,
    });
    const baseClosedLine = L.polyline(this.translator.moveTo(baseClosedLLs), {
      color: 'darkviolet',
      pmIgnore: true,
    });
    this.baseContourGroup.addLayer(baseLine);
    this.baseContourGroup.addLayer(baseClosedLine);

    // const beacons2 = gameModel.getBeacons().map(this.translator.moveTo);
    const beacons2 = gameModel.get('beacons').map(this.translator.moveTo);

    const markers = beacons2.map(({
      lat, lng, name, id,
    }) => L.marker({ lat, lng }, { id, name }));
    markers.forEach((marker) => {
      this.setMarkerEventHandlers(marker);
      marker.on('mouseover', function (e) {
        marker.bindTooltip(t('markerTooltip', { name: this.options.name }));
        this.openTooltip();
      });
      marker.on('mouseout', function (e) {
        this.closeTooltip();
      });
      this.markerGroup.addLayer(marker);
    });

    this.locationsLayer.populateLocations(gameModel, this.translator, this.setLocationEventHandlers, t);

    this.updateMarkersView();
    // this.updateLocationsView();
    this.locationsLayer.updateLocationsView();
    this.onMarkersChange();
  }

  // eslint-disable-next-line react/sort-comp
  clearMapData() {
    this.baseContourGroup.clearLayers();
    this.markerGroup.clearLayers();
    // this.locationsGroup.clearLayers();
    this.locationsLayer.clear();
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

  updateMarkersView = () => {
    const { gameModel } = this.props;
    // const attachedMarkers = gameModel.getAttachedBeaconIds();
    const attachedMarkers = gameModel.get('attachedBeaconIds');
    this.markerGroup.eachLayer((marker) => {
      const { id } = marker.options;
      marker.setIcon(getIcon(R.contains(id, attachedMarkers) ? 'blue' : 'red'));
    });
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
    // gameModel.putLocation(location.options.id, this.translator.moveFrom({
    //   latlngs: location.getLatLngs(),
    // }));
    gameModel.execute({
      type: 'putLocation',
      id: location.options.id,
      props: {
        ...this.translator.moveFrom({
          latlngs: location.getLatLngs(),
        }),
      },
    });
    // putLocation(location.options.id, );
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

    const { markers } = layer.options;
    this.markerGroup.eachLayer((marker) => {
      const { id } = marker.options;
      if (R.contains(id, markers)) {
        marker.setIcon(getIcon('green'));
      }
    });
  }

  resetLocationHighlight = () => {
    // this.updateLocationsView();
    this.locationsLayer.updateLocationsView();
    this.updateMarkersView();
  }

  onMarkersChange = () => {
    this.updateSignalRadiuses();
    this.updateVoronoiPolygons();
  }

  onMarkerEdit = (e) => {
    const { gameModel } = this.props;
    const marker = e.target;
    // gameModel.putBeacon(marker.options.id, this.translator.moveFrom(marker.getLatLng()));
    gameModel.execute({
      type: 'putBeacon',
      id: marker.options.id,
      props: {
        ...this.translator.moveFrom(marker.getLatLng()),
      },
    });
    this.onMarkersChange();
    this.closeMarkerPopup();
    // console.log('pm:edit', e.target.getLatLng());
  };

  updateVoronoiPolygons = () => {
    const { gameModel } = this.props;
    // const { boundingPolylineData, polygonData } = gameModel.getVoronoiPolygonData();
    const { boundingPolylineData, polygonData } = gameModel.get('voronoiPolygonData');
    this.massCentersGroup.clearLayers();
    this.polygonsGroup.clearLayers();

    const boundingPolyline = L.polyline(this.translator.moveTo(boundingPolylineData), { color: 'blue' });
    const polygons = polygonData.clippedPolygons.map((polygon, i) => L.polygon(this.translator.moveTo(polygon), {
      fillColor: COLOR_PALETTE[i % COLOR_PALETTE.length].color.background,
      fillOpacity: 0.5,
      pmIgnore: true,
    }));

    polygons.forEach((p) => this.polygonsGroup.addLayer(p));
    this.polygonsGroup.addLayer(boundingPolyline);

    const massCenters = polygonData.clippedCenters
      .filter((massCenter) => !Number.isNaN(massCenter.x) && !Number.isNaN(massCenter.y))
      .map((massCenter) => L.circleMarker(this.translator.moveTo([massCenter.x, massCenter.y]), {
        radius: 5,
        pmIgnore: true,
      }));
    massCenters.forEach((p) => this.massCentersGroup.addLayer(p));
  }

  updateSignalRadiuses = () => {
    const { gameModel } = this.props;
    this.signalRadiusesGroup.clearLayers();
    // gameModel.getBeacons().map(this.translator.moveTo).forEach((beacon) => {
    gameModel.get('beacons').map(this.translator.moveTo).forEach((beacon) => {
      this.signalRadiusesGroup.addLayer(L.circle({
        lat: beacon.lat,
        lng: beacon.lng,
      }, {
        radius: 13,
        pmIgnore: true,
      }));
    });
  }

  onMarkerChange = (prop) => (e) => {
    const { value } = e.target;
    const { gameModel } = this.props;
    const { id } = this.state.curMarker;
    const marker = this.markerGroup.getLayers().find((marker2) => marker2.options.id === id);
    let resValue = value;
    if (prop === 'name') {
      marker.options.name = value;
      // gameModel.putBeacon(id, {
      //   [prop]: value,
      // });
      gameModel.execute({
        type: 'putBeacon',
        id,
        props: {
          [prop]: value,
        },
      });
    }
    if (prop === 'lat' || prop === 'lng') {
      const latLng = marker.getLatLng();
      const num = Number(value);
      if (!Number.isNaN(num)) {
        const newLatLng = { ...latLng, [prop]: num };
        marker.setLatLng(newLatLng);
        // gameModel.putBeacon(id, this.translator.moveFrom({
        //   ...latLng,
        //   [prop]: num,
        // }));
        gameModel.execute({
          type: 'putBeacon',
          id,
          props: {
            ...this.translator.moveFrom({
              ...latLng,
              [prop]: num,
            }),
          },
        });
        this.onMarkersChange();
        resValue = num;
      }
    }

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

    this.locationsLayer.updateLocationsView();
    this.updateMarkersView();

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

  getMarkerPopup = () => {
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
  getMusicSelect = () => {
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


  getLocationPopup = () => {
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
