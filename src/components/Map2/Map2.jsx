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

import { mapConfig, geomanConfig, defaultTileLayer } from './MapConfigurations';

import { markerPopupDom, locationPopupDom, musicSelectDom } from '../../utils/domUtils';

import { applyLeafletGeomanTranslation, getZoomTranslation } from '../../translations';

import { animate, Timing } from '../../utils/animation';

import { UserWatcher } from './UserWatcher';

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
    this.onBotUpdate = this.onBotUpdate.bind(this);
  }

  // eslint-disable-next-line max-lines-per-function
  componentDidMount = () => {
    const { center, zoom } = mapConfig;
    const { simulateGeoDataStream, soundService, curPosition, gameModel } = this.props;
    const { urlTemplate, options } = defaultTileLayer;
    this.userWatcher = new UserWatcher(soundService);
    this.translator = new Translator(center, curPosition);

    gameModel.on('botUpdate', this.onBotUpdate);

    this.map = L.map(this.mapEl, {
      center,
      zoom,
      zoomControl: false,
    });
    // Svg image proof of concept
    // // const imageUrl = 'images/test.svg';
    // // const imageUrl = 'images/sr2020_base_map1.svg';
    // const imageUrl = 'images/sr2020_base_map2.svg';
    // const width=976;
    // const height=578;

    // // (y1 - y2) / height = (x2 - x1) / width
    // const y1 = 54.930300122616605;
    // const x1 = 36.86880692955018;
    // const y2 = 54.926889453719246;
    // const x2 = 36.87855139322438;
    // // const x2 = ((y1 - y2) / height) * width + x1;
    // const imageBounds = [
    //   [y1, x1],
    //   [y2, x2]
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

    // const legend = L.control({ position: 'bottomleft' });
    const legend = L.control({ position: 'topright' });
    legend.onAdd = function (map) {
      return musicSelectDom;
    };
    L.DomEvent.on(musicSelectDom, 'dblclick', (ev) => {
      L.DomEvent.stopPropagation(ev);
    });
    L.DomEvent.disableScrollPropagation(musicSelectDom);

    legend.addTo(this.map);

    this.map.on('locationfound', (e) => {
      // console.log(e);
      this.userWatcher.updateUserLocation(e, this.locationsGroup.getLayers());
    });

    this.patchLeafletMap();

    const lc = L.control.locate({
      setView: false,
    }).addTo(this.map);
    lc.start();
    // Interesting object which can be used to draw position with arrow
    // L.Control.Locate.prototype.options.compassClass

    if (simulateGeoDataStream) {
      this.simulateUserMovement(center);
    }
    // this.map.pm.toggleGlobalDragMode();
  }

  // eslint-disable-next-line react/sort-comp
  patchLeafletMap() {
    const that = this;
    const oldHandler = this.map._handleGeolocationResponse;
    this.map._handleGeolocationResponse = function (pos) {
      const { simulateGeoDataStream } = that.props;
      if (simulateGeoDataStream && !pos.artificial) {
        return;
      }
      // console.log('pos', pos);
      oldHandler.call(this, pos);
    }.bind(this.map);
  }

  // combine with patchLeafletMap
  simulateUserMovement(center) {
    const speed = 1;
    const rx = 0.0005;
    const ry = 0.0007;

    this.stopUserMovement();

    this.userMovementSimulation = animate({
      duration: 20000,
      timing: Timing.makeEaseInOut(Timing.linear),
      draw: (function (progress) {
        const artificialPos = {
          coords: {
            accuracy: 10,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            latitude: center[0] + Math.cos(progress * speed * 2 * Math.PI) * rx,
            longitude: center[1] + Math.sin(progress * speed * 2 * Math.PI) * ry,
            speed: null,
          },
          timestamp: Date.now(),
          artificial: true,
        };

        this.map._handleGeolocationResponse(artificialPos);
      }).bind(this),
      loop: true,
    });
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.dataService !== this.props.dataService) {
      this.clearMapData();
      this.populateMapData();
    }
    if (prevProps.soundService !== this.props.soundService) {
      this.userWatcher.dispose();
      this.userWatcher = new UserWatcher(this.props.soundService);
    }
    if (prevProps.simulateGeoDataStream !== this.props.simulateGeoDataStream) {
      this.refreshUserMovementSimulation();
    }
    if (prevProps.curPosition !== this.props.curPosition) {
      const { center } = mapConfig;
      this.map.panTo(this.props.curPosition || center);
      console.log('position changed');
      this.translator = new Translator(center, this.props.curPosition);
      this.clearMapData();
      this.populateMapData();
      this.props.soundService.stopAllSounds();
      this.refreshUserMovementSimulation();
    }
    // console.log('Map2 did update');
  }

  refreshUserMovementSimulation() {
    const { simulateGeoDataStream, curPosition } = this.props;
    if (simulateGeoDataStream) {
      const { center } = mapConfig;
      this.simulateUserMovement(curPosition || center);
    } else {
      this.stopUserMovement();
    }
  }

  stopUserMovement() {
    if (this.userMovementSimulation) {
      this.userMovementSimulation.enable = false;
    }
  }

  componentWillUnmount = () => {
    this.userWatcher.dispose();
    this.stopUserMovement();
    this.props.gameModel.off('botUpdate', this.onBotUpdate);
  }

  onBotUpdate() {
    console.log('On bot update');
    const activeBots = this.props.gameModel.getActiveBots();
    const botMap = R.indexBy((bot) => bot.getName(), activeBots);
    const botsOnMap = this.botGroup.getLayers();
    const botsTracksOnMap = this.botTrackGroup.getLayers();
    const curMarkers = {};
    botsOnMap.forEach((botMarker) => {
      const bot = botMap[botMarker.options.id];
      if (!bot) {
        this.botGroup.removeLayer(botMarker);
      } else {
        curMarkers[botMarker.options.id] = true;
        botMarker.setLatLng(bot.getCutPosition());
      }
    });
    botsTracksOnMap.forEach((botTrack) => {
      const bot = botMap[botTrack.options.id];
      if (!bot) {
        this.botTrackGroup.removeLayer(botTrack);
      }
    });
    activeBots.filter((bot) => !curMarkers[bot.getName()]).forEach((bot, i) => {
      const botMarker = L.marker(bot.getCutPosition(), { id: bot.getName() });
      this.botGroup.addLayer(botMarker);
      const botTrack = L.polyline(bot.getPath(), {
        id: bot.getName(),
        color: COLOR_PALETTE[i % COLOR_PALETTE.length].color.background,
      });
      this.botTrackGroup.addLayer(botTrack);
    });
  }

  onCreateLayer = (event) => {
    if (event.layer instanceof L.Marker) {
      this.onCreateMarker(event.layer);
    } else {
      this.onCreateLocation(event.layer);
    }
  }

  onCreateMarker = (marker) => {
    const { dataService } = this.props;
    const latlng = this.translator.moveFrom(marker.getLatLng());
    const { id, name } = dataService.postBeacon(latlng);
    L.setOptions(marker, { id, name });
    this.markerGroup.addLayer(marker);

    this.setMarkerEventHandlers(marker);
    this.onMarkersChange();
    this.updateMarkersView();
  }

  onCreateLocation = (location) => {
    const { dataService } = this.props;
    const { id, name, markers } = dataService.postLocation(this.translator.moveFrom({
      latlngs: location.getLatLngs(),
    }));
    L.setOptions(location, { id, name, markers });
    this.locationsGroup.addLayer(location);
    this.setLocationEventHandlers(location);
    this.updateLocationsView();
  }

  onRemoveLayer = (event) => {
    const { dataService } = this.props;
    if (event.layer instanceof L.Marker) {
      const markerId = event.layer.options.id;
      this.removeMarkerFromLocations(markerId);
      this.updateLocationsView();
      this.markerGroup.removeLayer(event.layer);
      this.onMarkersChange();
      dataService.deleteBeacon(event.layer.options.id);
    } else {
      this.locationsGroup.removeLayer(event.layer);
      dataService.deleteLocation(event.layer.options.id);
      this.updateLocationsView();
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
    this.locationsGroup = L.layerGroup([]);
    this.botTrackGroup = L.layerGroup([]);
    this.botGroup = L.layerGroup([]);

    this.baseContourGroup.addTo(this.map);
    // polygonsGroup.addTo(this.map);
    // massCentersGroup.addTo(this.map);
    // this.signalRadiusesGroup.addTo(this.map);
    // this.markerGroup.addTo(this.map);
    this.locationsGroup.addTo(this.map);
    this.botTrackGroup.addTo(this.map);
    this.botGroup.addTo(this.map);

    const overlayMaps = {
      [t('baseContourLayer')]: this.baseContourGroup,
      [t('beaconsLayer')]: this.markerGroup,
      [t('massCentersLayer')]: this.massCentersGroup,
      [t('voronoiPolygonsLayer')]: this.polygonsGroup,
      [t('signalRadiusesLayer')]: this.signalRadiusesGroup,
      [t('locationsLayer')]: this.locationsGroup,
      [t('botTrackLayer')]: this.botTrackGroup,
      [t('botLayer')]: this.botGroup,
    };

    L.control.layers(null, overlayMaps).addTo(this.map);
  }

  populateMapData = () => {
    const { dataService, t } = this.props;

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

    const beacons2 = dataService.getBeacons().map(this.translator.moveTo);

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

    const locationsData = dataService.getLocations().map(this.translator.moveTo);

    const locations = locationsData.map(({
      // eslint-disable-next-line no-shadow
      latlngs, name, id, markers, manaLevel,
    }) => L.polygon(latlngs, {
      id, name, markers, manaLevel,
    }));
    locations.forEach((loc) => {
      this.setLocationEventHandlers(loc);
      loc.on('mouseover', function (e) {
        loc.bindTooltip(t('locationTooltip', { name: this.options.name }));
        this.openTooltip();
      });
      loc.on('mouseout', function (e) {
        this.closeTooltip();
      });
      this.locationsGroup.addLayer(loc);
    });

    this.updateMarkersView();
    this.updateLocationsView();
    this.onMarkersChange();
  }

  clearMapData = () => {
    this.baseContourGroup.clearLayers();
    this.markerGroup.clearLayers();
    this.locationsGroup.clearLayers();
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
    const { dataService } = this.props;
    const attachedMarkers = dataService.getAttachedBeaconIds();
    this.markerGroup.eachLayer((marker) => {
      const { id } = marker.options;
      marker.setIcon(getIcon(R.contains(id, attachedMarkers) ? 'blue' : 'red'));
    });
  }

  updateLocationsView = () => {
    this.locationsGroup.getLayers().forEach((loc, i) => {
      const { markers, manaLevel } = loc.options;
      loc.setStyle({
        color: markers.length > 0 ? 'blue' : 'red',
        // fillColor: COLOR_PALETTE[i % COLOR_PALETTE.length].color.background,
        // fillOpacity: 0.5,
        fillOpacity: 0.8,
        // eslint-disable-next-line no-nested-ternary
        // fillColor: COLOR_PALETTE[manaLevel === 'low' ? 0
        //   : (manaLevel === 'normal' ? 12
        //     : 16)].color.background,
        // eslint-disable-next-line no-nested-ternary
        fillColor: manaLevel === 'low' ? 'hsla(233, 0%, 50%, 1)'
          : (manaLevel === 'normal' ? 'hsla(233, 50%, 50%, 1)'
            : 'hsla(233, 100%, 50%, 1)'),
        // fillOpacity:
        //   // eslint-disable-next-line no-nested-ternary
        //   manaLevel === 'low' ? 0.2
        //     : (manaLevel === 'normal' ? 0.6
        //       : 1)
        // ,
      });
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
    const { dataService } = this.props;
    const location = e.target;
    dataService.putLocation(location.options.id, this.translator.moveFrom({
      latlngs: location.getLatLngs(),
    }));
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
    this.updateLocationsView();
    this.updateMarkersView();
  }

  onMarkersChange = () => {
    this.updateSignalRadiuses();
    this.updateVoronoiPolygons();
  }

  onMarkerEdit = (e) => {
    const { dataService } = this.props;
    const marker = e.target;
    dataService.putBeacon(marker.options.id, this.translator.moveFrom(marker.getLatLng()));
    this.onMarkersChange();
    this.closeMarkerPopup();
    // console.log('pm:edit', e.target.getLatLng());
  };

  updateVoronoiPolygons = () => {
    const { dataService } = this.props;
    const { boundingPolylineData, polygonData } = dataService.getVoronoiPolygonData();
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
    const { dataService } = this.props;
    this.signalRadiusesGroup.clearLayers();
    dataService.getBeacons().map(this.translator.moveTo).forEach((beacon) => {
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
    const { dataService } = this.props;
    const { id } = this.state.curMarker;
    const marker = this.markerGroup.getLayers().find((marker2) => marker2.options.id === id);
    let resValue = value;
    if (prop === 'name') {
      marker.options.name = value;
      dataService.putBeacon(id, {
        [prop]: value,
      });
    }
    if (prop === 'lat' || prop === 'lng') {
      const latLng = marker.getLatLng();
      const num = Number(value);
      if (!Number.isNaN(num)) {
        const newLatLng = { ...latLng, [prop]: num };
        marker.setLatLng(newLatLng);
        dataService.putBeacon(id, this.translator.moveFrom({
          ...latLng,
          [prop]: num,
        }));
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
    const { dataService } = this.props;
    const locId = this.state.curLocation.id;
    this.removeMarkerFromLocations(markerId);
    const loc = this.locationsGroup.getLayers().find((loc2) => loc2.options.id === locId);
    const props = loc.options;
    if (action === 'add') {
      props.markers = [...props.markers];
      props.markers.push(markerId);
    } else if (action === 'remove') {
      props.markers = props.markers.filter((el) => el !== markerId);
    } else {
      console.error(`Unknown action ${action}`);
    }
    dataService.putLocation(locId, {
      markers: R.clone(props.markers),
    });

    this.updateLocationsView();
    this.updateMarkersView();

    this.setState((state) => {
      const curLocation = { ...state.curLocation, markers: props.markers };
      return ({
        curLocation,
      });
    });
  }

  removeMarkerFromLocations = (markerId) => {
    const { dataService } = this.props;
    this.locationsGroup.eachLayer((loc2) => {
      const props = loc2.options;
      if (R.contains(markerId, props.markers)) {
        props.markers = props.markers.filter((el) => el !== markerId);
        dataService.putLocation(props.id, {
          markers: R.clone(props.markers),
        });
      }
    });
  }

  onLocationChange = (prop) => (e) => {
    const { value } = e.target;
    const { dataService } = this.props;
    const { id } = this.state.curLocation;
    const location = this.locationsGroup.getLayers().find((loc) => loc.options.id === id);
    if (prop === 'name' || prop === 'manaLevel') {
      location.options[prop] = value;
      dataService.putLocation(id, {
        [prop]: value,
      });
    }
    this.setState((state) => {
      const curLocation = { ...state.curLocation, [prop]: value };
      return ({
        curLocation,
      });
    });
    this.updateLocationsView();
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

  getMusicSelect = () => {
    const {
      soundService,
    } = this.props;
    // if (!curMarker) {
    //   return null;
    // }
    return (
      <MusicSelect soundService={soundService} userWatcher={this.userWatcher} />
    );
  }

  getLocationPopup = () => {
    const {
      curLocation,
    } = this.state;
    const {
      dataService,
    } = this.props;
    if (!curLocation) {
      return null;
    }
    const allBeacons = R.clone(dataService.getBeacons());
    const allLocations = R.clone(dataService.getLocations());
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
