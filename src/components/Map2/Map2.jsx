import React, { Component } from 'react';
import './Map2.css';
import * as R from 'ramda';
import shortid from 'shortid';

import '../../utils/gpxConverter';

import L from 'leaflet/dist/leaflet-src';
import 'leaflet/dist/leaflet.css';

import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

import {
  Map, TileLayer, Marker, Popup
} from 'react-leaflet';

import MarkerPopup from './MarkerPopup';
import LocationPopup from './LocationPopup';


import { getBeacons } from '../../data/beacons';

import { baseClosedLLs, baseLLs, baseCommonLLs } from '../../data/baseContours';

import { getPolygons, getPolygons2 } from '../../utils/polygonGenerator';

import { getBoundingRect, scaleRect } from '../../utils/polygonUtils';

import { getIcon } from '../../utils/icons';

import ColorPalette from '../../utils/colorPalette';

console.log(L);
L.Icon.Default.imagePath = './images/leafletImages/';


const getGeoProps = layer => layer.feature.properties;
// const getGeoProps = layer => layer.pm._layers[0].feature.properties;

//
// const minZoom = 14;
const maxZoom = 20;
const minZoom = null;

// const geojsonFeature = ({ lng, lat }) => ({
//   type: 'Feature',
//   properties: {
//     name: 'Coors Field',
//     amenity: 'Baseball Stadium',
//     popupContent: 'This is where the Rockies play!',
//     complexData: {
//       type: 'Feature',
//       properties: {
//         name: 'Coors Field',
//         amenity: 'Baseball Stadium',
//         popupContent: 'This is where the Rockies play!'
//       },
//       geometry: {
//         type: 'Point',
//         coordinates: [lng, lat]
//       }
//     }
//   },
//   geometry: {
//     type: 'Point',
//     coordinates: [lng, lat]
//   }
// });


// const myStyle = {
//   // "color": "#ff7800",
//   color: '#ff0000',
//   weight: 5,
//   opacity: 0.65
// };

// const myLines = ({ lng, lat }) => [{
//   type: 'LineString',
//   coordinates:
//   [[lng, lat - 0.005],
//     [lng - 0.01, lat - 0.005],
//     [lng - 0.005, lat]]
// // }, {
// //   "type": "LineString",
// //   "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
// }];

export default class Map2 extends Component {
  state = {
    lat: 54.928743,
    lng: 36.871746,
    zoom: 17,
    curMarker: null,
    curLocation: null
    // zoom: 16,
  }

  componentDidMount = () => {
    console.log('Map2 mounted');
    const { lat, lng, zoom } = this.state;
    // this.geojsonFeature = geojsonFeature(this.state);
    this.map = L.map(this.mapEl, {
      center: [lat, lng],
      zoom,
      // minZoom
    });
    // .setView([lat, lng], zoom);

    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   attribution: '&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    //   maxZoom,
    //   // id: 'mapbox.streets',
    //   // accessToken: 'your.mapbox.access.token'
    // }).addTo(this.map);

    L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      maxZoom,
      opacity: 0.4,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }).addTo(this.map);

    this.map.pm.addControls({
      position: 'topleft',
      drawCircleMarker: false,
      drawPolyline: false,
      cutPolygon: false,
      drawCircle: false,
      drawRectangle: false
    });

    this.fillMap();

    this.map.on('pm:create', this.onCreate);

    this.map.on('pm:remove', event => {
      if (event.layer instanceof L.Marker) {
        const markerName = getGeoProps(event.layer).name;
        this.removeMarkerFromLocations(markerName);
        this.updateLocationsView();
        this.markerGroup.removeLayer(event.layer);
        this.onMarkersChange();
        // this.updateSignalRadiuses();
        // this.updatePolygons();
      } else {
        this.locationsGroup.removeLayer(event.layer);
        this.saveLocations();
        this.updateLocationsView();
        this.updateMarkersView();
        // this.locationsGroup.addLayer(event.layer);
      }
      // console.log('pm:remove');
    });

    // this.map.pm.toggleGlobalDragMode();
    // this.getStateInfo();
  }

  onCreate = event => {
    if (event.layer instanceof L.Marker) {
      this.onCreateMarker(event.layer);
    } else {
      this.onCreateLocation(event.layer);
    }
  }

  onCreateMarker = marker => {
    const geo = marker.toGeoJSON();
    this.map.removeLayer(marker);

    const marker2 = L.geoJSON(geo).getLayers()[0];
    getGeoProps(marker2).name = shortid.generate();
    this.markerGroup.addLayer(marker2);


    marker2.on('pm:edit', () => this.onMarkerEdit());

    this.setMarkerClickHandler(marker2);
    this.onMarkersChange();
    this.updateMarkersView();
  }

  onCreateLocation = location => {
    const geo = location.toGeoJSON();
    this.map.removeLayer(location);

    const location2 = L.geoJSON(geo).getLayers()[0];
    getGeoProps(location2).name = shortid.generate();
    getGeoProps(location2).markers = [];
    this.locationsGroup.addLayer(location2);

    this.setLocationEventHandlers(location2);


    // this.locationsGroup.addLayer(event.layer);
    location2.on('pm:edit', () => this.saveLocations());
    this.saveLocations();
    this.updateLocationsView();
  }

  fillMap = () => {
    const baseLine = L.polyline(baseLLs, {
      color: 'green',
      pmIgnore: true
    });
    const baseClosedLine = L.polyline(baseClosedLLs, {
      color: 'darkviolet',
      pmIgnore: true
    });

    const beacons = this.loadMarkers();

    this.markerPopup = L.popup();
    this.locationPopup = L.popup();
    const markers = this.getMarkers(beacons);

    const locationsData = this.loadLocations();

    const locations = locationsData.map(loc => L.geoJSON(loc).getLayers()[0]);
    locations.forEach((loc, i) => {
      // const polygons = polygonData.clippedPolygons.map((polygon, i) => L.polygon(polygon, {
      //   pmIgnore: true
      // }));
      // const text = JSON.stringify(getGeoProps(loc), null, '  ');
      // loc.bindPopup(text);
      this.setLocationEventHandlers(loc);
      // loc.setStyle({
      //   fillColor: ColorPalette[i % ColorPalette.length].color.background,
      //   fillOpacity: 0.5,
      // });
      loc.on('pm:edit', () => this.saveLocations());
    });


    const baseContourGroup = L.layerGroup([baseLine, baseClosedLine]);
    this.polygonsGroup = L.layerGroup([]);
    this.massCentersGroup = L.layerGroup([]);
    this.signalRadiusesGroup = L.layerGroup([]);
    this.markerGroup = L.layerGroup(markers);
    this.locationsGroup = L.layerGroup(locations);

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

    this.updateSignalRadiuses();
    this.updatePolygons();
    this.updateMarkersView();
    this.updateLocationsView();
    // this.onMarkersChange();
  }


  // const popup = L.popup();
  // // .setLatLng([lat, lng])
  // // .setContent("I am a standalone popup.")
  // // .openOn(this.map);

  // function onMapClick(e) {
  //   popup
  //     .setLatLng(e.latlng)
  //     .setContent(`You clicked the map at ${e.latlng.toString()}`)
  //     .openOn(this.map);
  // }

  // this.map.on('click', onMapClick.bind(this));

  getMarkers = beacons => {
    const markers = beacons.map(beacon => {
      try {
        return L.geoJSON(beacon).getLayers()[0];
      } catch (err) {
        return null;
      }
    }).filter(marker => !!marker);
    markers.forEach(marker => {
      this.setMarkerClickHandler(marker);
      // marker.setIcon(getIcon('red'));
      // const text = JSON.stringify(getGeoProps(marker), null, '  ');
      // marker.bindPopup(text);
      marker.on('pm:edit', () => this.onMarkerEdit());
    });
    return markers;
  }

  setMarkerClickHandler = marker => {
    marker.on('click', e => {
      console.log(e);
      const text = JSON.stringify(getGeoProps(e.target), null, '  ');
      console.log('geoProps', text);
      // markerPopup.setLatLng(e.latlng).setContent(text).openOn(this.map);
      this.setState({
        curMarker: {
          lat: e.target.getLatLng().lat,
          lng: e.target.getLatLng().lng,
          name: getGeoProps(e.target).name
        }
      });
      this.markerPopup.setLatLng(e.latlng).setContent(this.markerPopupContent).openOn(this.map);
    });
  }

  updateMarkersView = () => {
    const attachedMarkers = this.getAttachedMarkerNames();
    this.markerGroup.eachLayer(marker => {
      const { name } = getGeoProps(marker);
      marker.setIcon(getIcon(R.contains(name, attachedMarkers) ? 'blue' : 'red'));
    });
  }

  updateLocationsView = () => {
    this.locationsGroup.getLayers().forEach((loc, i) => {
      const { markers = [] } = getGeoProps(loc);
      loc.setStyle({
        color: markers.length > 0 ? 'blue' : 'red',
        fillColor: ColorPalette[i % ColorPalette.length].color.background,
        fillOpacity: 0.5,
      });
    });
  }

  getMarkerNames = () => R.uniq(this.markerGroup.getLayers().map(marker => getGeoProps(marker).name))

  getAttachedMarkerNames = () => {
    const allArrs = this.locationsGroup.getLayers().map(loc => getGeoProps(loc).markers);
    return R.uniq(R.flatten(allArrs));
  }

  setLocationEventHandlers = location => {
    location.on({
      click: this.onLocationClick,
      mouseover: this.highlightLocation,
      mouseout: this.resetLocationHighlight,
    });
  }

  onLocationClick = e => {
    // const text = JSON.stringify(getGeoProps(e.target), null, '  ');
    // console.log('geoProps', text);
    this.setState({
      curLocation: {
        name: getGeoProps(e.target).name,
        markers: getGeoProps(e.target).markers || []
      }
    });
    this.locationPopup.setLatLng(e.latlng).setContent(this.locationPopupContent).openOn(this.map);
  }

  highlightLocation = e => {
    const layer = e.target;

    layer.setStyle({
      weight: 5,
      color: 'green',
      dashArray: '',
      fillOpacity: 1
    });

    const { markers } = getGeoProps(layer);
    this.markerGroup.eachLayer(marker => {
      const { name } = getGeoProps(marker);
      if (R.contains(name, markers)) {
        marker.setIcon(getIcon('green'));
        // marker.setStyle({
        //   weight: 5,
        //   color: 'green',
        //   dashArray: '',
        //   fillOpacity: 1
        // });
      }
    });

    // if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    //   layer.bringToFront();
    // }
  }

  resetLocationHighlight = e => {
    this.updateLocationsView();
    this.updateMarkersView();
    // geojson.resetStyle(e.target);
  }

  onMarkersChange = () => {
    this.updateSignalRadiuses();
    this.updatePolygons();
    this.saveMarkers();
  }

  onMarkerEdit = () => {
    this.onMarkersChange();
    console.log('pm:edit');
  };

  saveMarkers = () => {
    localStorage.setItem('markers', JSON.stringify(this.markerGroup.toGeoJSON().features));
    // console.log(this.markerGroup.toGeoJSON().features);
    // console.log('beacons', getBeacons());
  }

  loadMarkers = () => {
    const markers = localStorage.getItem('markers');
    return markers ? JSON.parse(markers) : getBeacons();
  }

  saveLocations = () => {
    localStorage.setItem('locations', JSON.stringify(this.locationsGroup.toGeoJSON().features));
  }

  loadLocations = () => {
    const locations = localStorage.getItem('locations');
    return locations ? JSON.parse(locations) : [];
  }

  updatePolygons = () => {
    this.massCentersGroup.clearLayers();
    this.polygonsGroup.clearLayers();
    const bRect1 = (getBoundingRect(baseCommonLLs));
    const bRect = scaleRect(bRect1, 1.1);
    // console.log('baseCommonLLs', baseCommonLLs, bRect1, bRect);

    const boundingPolyline = L.polyline(this.boundingRect2Polyline(bRect), { color: 'blue' });

    const plainPoints = this.markerGroup.getLayers().map(layer => ({
      x: layer.getLatLng().lat,
      y: layer.getLatLng().lng
    }));
    // console.log('plainPoints', plainPoints);
    const polygonData = getPolygons2(plainPoints,
      [bRect.bottom, bRect.left, bRect.top, bRect.right],
      // , null);
      baseCommonLLs);

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
    this.signalRadiusesGroup.clearLayers();
    this.markerGroup.eachLayer(layer => {
      this.signalRadiusesGroup.addLayer(L.circle(layer.getLatLng(), {
        radius: 13,
        pmIgnore: true
      }));
    });
  }

  // basicExamples = () => {
  //   // .addTo(this.map)

  //   // L.

  //   // var circle = L.circle([lat, lng + 0.01], {
  //   //   color: 'red',
  //   //   fillColor: '#f03',
  //   //   fillOpacity: 0.5,
  //   //   radius: 500
  //   // }).addTo(this.map);

  //   // var polygon = L.polygon([
  //   // [lat, lng - 0.01],
  //   // [lat-0.02, lng - 0.01],
  //   // [lat - 0.01, lng]
  //   // ]).addTo(this.map);

  //   // marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
  //   // circle.bindPopup("I am a circle.");
  //   // polygon.bindPopup("I am a polygon.");

  //   const popup = L.popup();
  //   // .setLatLng([lat, lng])
  //   // .setContent("I am a standalone popup.")
  //   // .openOn(this.map);

  //   function onMapClick(e) {
  //     popup
  //       .setLatLng(e.latlng)
  //       .setContent(`You clicked the map at ${e.latlng.toString()}`)
  //       .openOn(this.map);
  //   }

  //   this.map.on('click', onMapClick.bind(this));

  //   // const layer = L.geoJSON(myLines(this.state), {style: myStyle}).addTo(this.map);
  //   // layer.addData(geojsonFeature(this.state));
  //   // layer.addData(myLines, {style: myStyle});
  // }

  boundingRect2Polyline = bRect => [
    [bRect.top, bRect.left],
    [bRect.top, bRect.right],
    [bRect.bottom, bRect.right],
    [bRect.bottom, bRect.left],
    [bRect.top, bRect.left],
  ];

  componentDidUpdate = () => {
    console.log('Map2 did update');
  }

  componentWillUnmount = () => {
    console.log('Map2 will unmount');
  }

  onMarkerChange = prop => e => {
    const { value } = e.target;
    // eslint-disable-next-line react/destructuring-assignment
    const { name } = this.state.curMarker;
    const marker = this.markerGroup.getLayers().find(marker2 => getGeoProps(marker2).name === name);
    if (prop === 'name') {
      getGeoProps(marker).name = value;
      this.renameMarkerInLocations(name, value);
    }
    if (prop === 'lat' || prop === 'lng') {
      const latLng = marker.getLatLng();
      const num = Number(value);
      if (!Number.isNaN(num)) {
        const newLatLng = { ...latLng, [prop]: num };
        marker.setLatLng(newLatLng);
        this.updateSignalRadiuses();
        this.updatePolygons();
      }
    }
    this.saveMarkers();
    this.setState(state => {
      const curMarker = { ...state.curMarker, [prop]: value };
      return ({
        curMarker
      });
    });
  }

  renameMarkerInLocations = (oldName, newName) => {
    this.locationsGroup.eachLayer(loc2 => {
      const props = getGeoProps(loc2);
      if (R.contains(oldName, props.markers)) {
        props.markers = props.markers.map(el => (el === oldName ? newName : el));
      }
    });
  }

  removeMarkerFromLocations = markerName => {
    this.locationsGroup.eachLayer(loc2 => {
      const props = getGeoProps(loc2);
      if (R.contains(markerName, props.markers)) {
        props.markers = props.markers.filter(el => el !== markerName);
      }
    });
  }

  onLocMarkerChange = ({ locName, action, markerName }) => {
    this.removeMarkerFromLocations(markerName);
    const loc = this.locationsGroup.getLayers().find(loc2 => getGeoProps(loc2).name === locName);
    const props = getGeoProps(loc);
    if (action === 'add') {
      props.markers = [...props.markers];
      props.markers.push(markerName);
    } else if (action === 'remove') {
      props.markers = props.markers.filter(el => el !== markerName);
    } else {
      console.error(`Unknown action ${action}`);
    }
    this.updateLocationsView();
    this.updateMarkersView();
    this.saveLocations();
    this.setState({
      curLocation: {
        name: props.name,
        markers: props.markers
      }
    });
  }

  onLocationChange = prop => e => {
    const { value } = e.target;
    // eslint-disable-next-line react/destructuring-assignment
    const { name } = this.state.curLocation;
    const marker = this.locationsGroup.getLayers().find(loc => getGeoProps(loc).name === name);
    if (prop === 'name') {
      getGeoProps(marker).name = value;
    }
    this.saveLocations();
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
    //   googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
    //     maxZoom: 20,
    //     subdomains:['mt0','mt1','mt2','mt3']
    // });
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
      const allMarkers = this.getMarkerNames();
      el2 = (
        <LocationPopup
          name={curLocation.name}
          attachedMarkers={curLocation.markers}
          allMarkers={allMarkers}
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
