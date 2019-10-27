import React, { Component } from 'react';
import './Map2.css';
import * as R from 'ramda';
import shortid from 'shortid';

import '../../utils/gpxConverter';

import L from 'leaflet/dist/leaflet-src';
import 'leaflet/dist/leaflet.css';

import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

import MarkerPopup from './MarkerPopup';
import LocationPopup from './LocationPopup';

import { baseClosedLLs, baseLLs, baseCommonLLs } from '../../data/baseContours';


import { getIcon } from '../../utils/icons';

import ColorPalette from '../../utils/colorPalette';

import { mapConfig, geomanConfig, defaultTileLayer } from './MapConfigurations';

// import playerTracks from '../../data/initialPlayerTracks';

// R.values(playerTracks).forEach((track, i) => {
//   L.polyline(track, {
//     color: ColorPalette[i % ColorPalette.length].color.border,
//   }).addTo(this.map);
// });

console.log(L);
L.Icon.Default.imagePath = './images/leafletImages/';

const getGeoProps = layer => layer.feature.properties;

export default class Map2 extends Component {
  state = {
    curMarker: null,
    curLocation: null
  }

  componentDidMount = () => {
    console.log('Map2 mounted');
    const { center, zoom } = mapConfig;
    const { urlTemplate, options } = defaultTileLayer;

    this.map = L.map(this.mapEl, {
      center,
      zoom,
    });
    L.tileLayer(urlTemplate, options).addTo(this.map);
    this.map.pm.addControls(geomanConfig);
    this.initMapBackbone();
    this.populateMapData();

    this.map.on('pm:create', this.onCreateLayer);
    this.map.on('pm:remove', this.onRemoveLayer);

    // this.map.pm.toggleGlobalDragMode();
  }

  componentDidUpdate = (prevProps, prevState) => {
    // eslint-disable-next-line react/destructuring-assignment
    if (prevProps.dataService !== this.props.dataService) {
      this.clearMapData();
      this.populateMapData();
    }
    // console.log('Map2 did update');
  }

  componentWillUnmount = () => {
    console.log('Map2 will unmount');
  }

  onCreateLayer = event => {
    if (event.layer instanceof L.Marker) {
      this.onCreateMarker(event.layer);
    } else {
      this.onCreateLocation(event.layer);
    }
  }

  onCreateMarker = marker => {
    const { dataService } = this.props;
    const { id, name } = dataService.postBeacon(marker.getLatLng());
    L.setOptions(marker, { id, name });
    this.markerGroup.addLayer(marker);

    this.setMarkerEventHandlers(marker);
    this.onMarkersChange();
    this.updateMarkersView();
  }

  onCreateLocation = location => {
    const { dataService } = this.props;
    const { id, name, markers } = dataService.postLocation({
      latlngs: location.getLatLngs()
    });
    L.setOptions(location, { id, name, markers });
    this.locationsGroup.addLayer(location);
    this.setLocationEventHandlers(location);
    this.updateLocationsView();
  }

  onRemoveLayer = event => {
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
    const { dataService } = this.props;
    const baseLine = L.polyline(baseLLs, {
      color: 'green',
      pmIgnore: true
    });
    const baseClosedLine = L.polyline(baseClosedLLs, {
      color: 'darkviolet',
      pmIgnore: true
    });

    this.markerPopup = L.popup();
    this.locationPopup = L.popup();

    const baseContourGroup = L.layerGroup([baseLine, baseClosedLine]);
    this.polygonsGroup = L.layerGroup([]);
    this.massCentersGroup = L.layerGroup([]);
    this.signalRadiusesGroup = L.layerGroup([]);
    this.markerGroup = L.layerGroup([]);
    this.locationsGroup = L.layerGroup([]);

    baseContourGroup.addTo(this.map);
    // polygonsGroup.addTo(this.map);
    // massCentersGroup.addTo(this.map);
    // this.signalRadiusesGroup.addTo(this.map);
    this.markerGroup.addTo(this.map);
    this.locationsGroup.addTo(this.map);

    const overlayMaps = {
      'Base contour': baseContourGroup,
      Markers: this.markerGroup,
      'Mass centers': this.massCentersGroup,
      'Voronoi polygons': this.polygonsGroup,
      'Signal radiuses': this.signalRadiusesGroup,
      Locations: this.locationsGroup
    };

    L.control.layers(null, overlayMaps).addTo(this.map);
  }

  populateMapData = () => {
    const { dataService } = this.props;
    const beacons2 = dataService.getBeacons();

    const markers = beacons2.map(({
      lat, lng, name, id
    }) => L.marker({ lat, lng }, { id, name }));
    markers.forEach(marker => {
      this.setMarkerEventHandlers(marker);
      this.markerGroup.addLayer(marker);
    });

    const locationsData = dataService.getLocations();

    const locations = locationsData.map(({
      // eslint-disable-next-line no-shadow
      latlngs, name, id, markers
    }) => L.polygon(latlngs, { id, name, markers }));
    locations.forEach((loc, i) => {
      this.setLocationEventHandlers(loc);
      this.locationsGroup.addLayer(loc);
    });

    this.updateMarkersView();
    this.updateLocationsView();
    this.onMarkersChange();
  }

  clearMapData = () => {
    this.markerGroup.clearLayers();
    this.locationsGroup.clearLayers();
  }

  setMarkerEventHandlers = marker => {
    marker.on({
      click: e => {
        this.setState({
          curMarker: {
            lat: e.target.getLatLng().lat,
            lng: e.target.getLatLng().lng,
            name: e.target.options.name,
            id: e.target.options.id
          }
        });
        this.markerPopup.setLatLng(e.latlng).setContent(this.markerPopupContent).openOn(this.map);
      },
      'pm:edit': this.onMarkerEdit
    });
  }

  updateMarkersView = () => {
    const { dataService } = this.props;
    const attachedMarkers = dataService.getAttachedBeaconIds();
    this.markerGroup.eachLayer(marker => {
      const { id } = marker.options;
      marker.setIcon(getIcon(R.contains(id, attachedMarkers) ? 'blue' : 'red'));
    });
  }

  updateLocationsView = () => {
    this.locationsGroup.getLayers().forEach((loc, i) => {
      const { markers } = loc.options;
      loc.setStyle({
        color: markers.length > 0 ? 'blue' : 'red',
        fillColor: ColorPalette[i % ColorPalette.length].color.background,
        fillOpacity: 0.5,
      });
    });
  }

  setLocationEventHandlers = location => {
    location.on({
      click: this.onLocationClick,
      mouseover: this.highlightLocation,
      mouseout: this.resetLocationHighlight,
      'pm:edit': this.onLocationEdit
    });
  }

  onLocationClick = e => {
    const { name, id, markers } = e.target.options;
    this.setState({
      curLocation: {
        id,
        name,
        markers
      }
    });
    this.locationPopup.setLatLng(e.latlng).setContent(this.locationPopupContent).openOn(this.map);
  }

  onLocationEdit = e => {
    const { dataService } = this.props;
    const location = e.target;
    dataService.putLocation(location.options.id, {
      latlngs: location.getLatLngs()
    });
    this.closeMarkerPopup();
  }

  highlightLocation = e => {
    const layer = e.target;

    layer.setStyle({
      weight: 5,
      color: 'green',
      dashArray: '',
      fillOpacity: 1
    });

    const { markers } = layer.options;
    this.markerGroup.eachLayer(marker => {
      const { id } = marker.options;
      if (R.contains(id, markers)) {
        marker.setIcon(getIcon('green'));
      }
    });
  }

  resetLocationHighlight = e => {
    this.updateLocationsView();
    this.updateMarkersView();
  }

  onMarkersChange = () => {
    this.updateSignalRadiuses();
    this.updateVoronoiPolygons();
  }

  onMarkerEdit = e => {
    const { dataService } = this.props;
    const marker = e.target;
    dataService.putBeacon(marker.options.id, marker.getLatLng());
    this.onMarkersChange();
    this.closeMarkerPopup();
    console.log('pm:edit', e.target.getLatLng());
  };

  updateVoronoiPolygons = () => {
    const { dataService } = this.props;
    const { boundingPolylineData, polygonData } = dataService.getVoronoiPolygonData();
    this.massCentersGroup.clearLayers();
    this.polygonsGroup.clearLayers();

    const boundingPolyline = L.polyline(boundingPolylineData, { color: 'blue' });

    const polygons = polygonData.clippedPolygons.map((polygon, i) => L.polygon(polygon, {
      fillColor: ColorPalette[i % ColorPalette.length].color.background,
      fillOpacity: 0.5,
      pmIgnore: true
    }));

    polygons.forEach(p => this.polygonsGroup.addLayer(p));
    this.polygonsGroup.addLayer(boundingPolyline);

    const massCenters = polygonData.clippedCenters.map((massCenter, i) => L.circleMarker([massCenter.x, massCenter.y], {
      radius: 5,
      pmIgnore: true
    }));
    massCenters.forEach(p => this.massCentersGroup.addLayer(p));
  }

  updateSignalRadiuses = () => {
    const { dataService } = this.props;
    this.signalRadiusesGroup.clearLayers();
    dataService.getBeacons().forEach(beacon => {
      this.signalRadiusesGroup.addLayer(L.circle({
        lat: beacon.lat,
        lng: beacon.lng,
      }, {
        radius: 13,
        pmIgnore: true
      }));
    });
  }

  onMarkerChange = prop => e => {
    const { value } = e.target;
    const { dataService } = this.props;
    // eslint-disable-next-line react/destructuring-assignment
    const { id, name } = this.state.curMarker;
    const marker = this.markerGroup.getLayers().find(marker2 => marker2.options.id === id);
    if (prop === 'name') {
      // getGeoProps(marker).name = value;
      marker.options.name = value;
      dataService.putBeacon(id, {
        [prop]: value
      });
    }
    if (prop === 'lat' || prop === 'lng') {
      const latLng = marker.getLatLng();
      const num = Number(value);
      if (!Number.isNaN(num)) {
        const newLatLng = { ...latLng, [prop]: num };
        marker.setLatLng(newLatLng);
        dataService.putBeacon(id, {
          [prop]: num
        });
        this.onMarkersChange();
      }
    }

    this.setState(state => {
      const curMarker = { ...state.curMarker, [prop]: value };
      return ({
        curMarker
      });
    });
  }

  onLocMarkerChange = ({ action, markerId }) => {
    const { dataService } = this.props;
    // eslint-disable-next-line react/destructuring-assignment
    const locId = this.state.curLocation.id;
    this.removeMarkerFromLocations(markerId);
    const loc = this.locationsGroup.getLayers().find(loc2 => loc2.options.id === locId);
    const props = loc.options;
    if (action === 'add') {
      props.markers = [...props.markers];
      props.markers.push(markerId);
    } else if (action === 'remove') {
      props.markers = props.markers.filter(el => el !== markerId);
    } else {
      console.error(`Unknown action ${action}`);
    }
    dataService.putLocation(locId, {
      markers: R.clone(props.markers)
    });

    this.updateLocationsView();
    this.updateMarkersView();

    this.setState(state => {
      const curLocation = { ...state.curLocation, markers: props.markers };
      return ({
        curLocation
      });
    });
  }

  removeMarkerFromLocations = markerId => {
    const { dataService } = this.props;
    this.locationsGroup.eachLayer(loc2 => {
      const props = loc2.options;
      if (R.contains(markerId, props.markers)) {
        props.markers = props.markers.filter(el => el !== markerId);
        dataService.putLocation(props.id, {
          markers: R.clone(props.markers)
        });
      }
    });
  }

  onLocationChange = prop => e => {
    const { value } = e.target;
    const { dataService } = this.props;
    // eslint-disable-next-line react/destructuring-assignment
    const { name, id } = this.state.curLocation;
    const location = this.locationsGroup.getLayers().find(loc => loc.options.id === id);
    if (prop === 'name') {
      location.options.name = value;
      dataService.putLocation(id, {
        [prop]: value
      });
    }
    this.setState(state => {
      const curLocation = { ...state.curLocation, [prop]: value };
      return ({
        curLocation
      });
    });
  }

  closeMarkerPopup = () => {
    this.map.closePopup();
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const {
      curMarker, curLocation
    } = this.state;
    const {
      dataService
    } = this.props;
    let el = null;
    if (curMarker) {
      el = (
        <MarkerPopup
          name={curMarker.name}
          lat={curMarker.lat}
          lng={curMarker.lng}
          onChange={this.onMarkerChange}
          onClose={this.closeMarkerPopup}
        />
      );
    }

    let el2 = null;
    if (curLocation) {
      const allBeacons = R.clone(dataService.getBeacons());
      const allLocations = R.clone(dataService.getLocations());
      el2 = (
        <LocationPopup
          name={curLocation.name}
          id={curLocation.id}
          attachedMarkers={curLocation.markers}
          allBeacons={allBeacons}
          allLocations={allLocations}
          onChange={this.onLocationChange}
          onLocMarkerChange={this.onLocMarkerChange}
          onClose={this.closeMarkerPopup}
        />
      );
    }

    return (
      <>
        <div
          className="Map2 h-full"
          ref={map => (this.mapEl = map)}
        />
        <div ref={markerPopup => (this.markerPopupContent = markerPopup)}>{el}</div>
        <div ref={locationPopup => (this.locationPopupContent = locationPopup)}>{el2}</div>
      </>
    );
  }
}
