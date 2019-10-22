import React, { Component } from 'react';
import './Map2.css';
import * as R from 'ramda';

import '../../utils/gpxConverter';

import L from 'leaflet/dist/leaflet-src';
import 'leaflet/dist/leaflet.css';

import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';


import {
  Map, TileLayer, Marker, Popup
} from 'react-leaflet';
import { getBeacons } from '../../data/beacons';

import { getPolygons, getPolygons2 } from '../../utils/polygonGenerator';

import { getBoundingRect, scaleRect } from '../../utils/polygonUtils';

import ColorPalette from '../../utils/colorPalette';

console.log(L);
L.Icon.Default.imagePath = './images/leafletImages/';


const getGeoProps = layer => layer.feature.properties;
// const getGeoProps = layer => layer.pm._layers[0].feature.properties;

//
// const minZoom = 14;
const maxZoom = 20;
const minZoom = null;

const geojsonFeature = ({ lng, lat }) => ({
  type: 'Feature',
  properties: {
    name: 'Coors Field',
    amenity: 'Baseball Stadium',
    popupContent: 'This is where the Rockies play!',
    complexData: {
      type: 'Feature',
      properties: {
        name: 'Coors Field',
        amenity: 'Baseball Stadium',
        popupContent: 'This is where the Rockies play!'
      },
      geometry: {
        type: 'Point',
        coordinates: [lng, lat]
      }
    }
  },
  geometry: {
    type: 'Point',
    coordinates: [lng, lat]
  }
});


const myStyle = {
  // "color": "#ff7800",
  color: '#ff0000',
  weight: 5,
  opacity: 0.65
};

const myLines = ({ lng, lat }) => [{
  type: 'LineString',
  coordinates:
  [[lng, lat - 0.005],
    [lng - 0.01, lat - 0.005],
    [lng - 0.005, lat]]
// }, {
//   "type": "LineString",
//   "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
}];

const baseClosedLLs = [
  [36.8720195, 54.9296674],
  [36.8720624, 54.9285209],
  [36.873028, 54.9285393],
  [36.8730924, 54.9282496],
  [36.8742725, 54.9282064],
  [36.874294, 54.9293469],
  [36.8741223, 54.9300065],
  [36.8727598, 54.9304504],
  [36.8723843, 54.9296675],
  [36.8720195, 54.9296674]
].map(R.reverse);

const baseLLs = [
  [36.8706891, 54.9300497],
  [36.8683717, 54.9279968],
  [36.873382, 54.9265912],
  [36.8744442, 54.9274728],
  [36.8724486, 54.9278242],
  [36.8724593, 54.9284284],
  [36.8720946, 54.9284284],
  [36.8720195, 54.9296674],
  [36.8710324, 54.9300682],
  [36.8706891, 54.9300497],
].map(R.reverse);

const baseCommonLLs = [
  [36.8706891, 54.9300497],
  [36.8683717, 54.9279968],
  [36.873382, 54.9265912],
  [36.8744442, 54.9274728],
  [36.8724486, 54.9278242],
  [36.8724593, 54.9284284],
  [36.8720946, 54.9284284],
  // [36.8720195,54.9296674],

  // [36.8720195,54.9296674],
  [36.8720624, 54.9285209],
  [36.873028, 54.9285393],
  [36.8730924, 54.9282496],
  [36.8742725, 54.9282064],
  [36.874294, 54.9293469],
  [36.8741223, 54.9300065],
  [36.8727598, 54.9304504],
  [36.8723843, 54.9296675],
  [36.8720195, 54.9296674],

  [36.8710324, 54.9300682],
  [36.8706891, 54.9300497],
].map(R.reverse);


const beaconLLs = [
  [54.928743, 36.871746],
  [54.928753, 36.871746],
  [54.928763, 36.871746],
  [54.928773, 36.871746],
];


export default class Map2 extends Component {
  state = {
    lat: 54.928743,
    lng: 36.871746,
    zoom: 17,
    // zoom: 16,
  }

  componentDidMount = () => {
    console.log('Map2 mounted');
    const { lat, lng, zoom } = this.state;
    this.geojsonFeature = geojsonFeature(this.state);
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

    this.map.on('pm:create', event => {
      if (event.layer instanceof L.Marker) {
        this.markerGroup.addLayer(event.layer);
        event.layer.on('pm:edit', () => this.onMarkerEdit());
        this.onMarkersChange();
        // this.updateSignalRadiuses();
        // this.updatePolygons();
      } else {
        this.locationsGroup.addLayer(event.layer);
        event.layer.on('pm:edit', () => this.saveLocations());
        this.saveLocations();
      }
    });

    this.map.on('pm:remove', event => {
      if (event.layer instanceof L.Marker) {
        this.markerGroup.removeLayer(event.layer);
        this.onMarkersChange();
        // this.updateSignalRadiuses();
        // this.updatePolygons();
      } else {
        this.locationsGroup.removeLayer(event.layer);
        this.saveLocations();
        // this.locationsGroup.addLayer(event.layer);
      }
      // console.log('pm:remove');
    });

    this.map.pm.toggleGlobalDragMode();
    // this.getStateInfo();
  }


  fillMap = () => {
    const baseLine = L.polyline(baseLLs, {
      color: 'green',
      pmIgnore: true
    });
    const baseClosedLine = L.polyline(baseClosedLLs, {
      color: 'red',
      pmIgnore: true
    });

    const beacons = this.loadMarkers();

    const markers = beacons.map(beacon => L.geoJSON(beacon).getLayers()[0]);
    markers.forEach(marker => {
      const text = JSON.stringify(getGeoProps(marker), null, '  ');
      marker.bindPopup(text);
      marker.on('pm:edit', () => this.onMarkerEdit());
    });

    const locationsData = this.loadLocations();

    const locations = locationsData.map(loc => L.geoJSON(loc).getLayers()[0]);
    locations.forEach((loc, i) => {
      // const polygons = polygonData.clippedPolygons.map((polygon, i) => L.polygon(polygon, {
      //   pmIgnore: true
      // }));
      const text = JSON.stringify(getGeoProps(loc), null, '  ');
      loc.bindPopup(text);
      loc.setStyle({
        fillColor: ColorPalette[i % ColorPalette.length].color.background,
        fillOpacity: 0.5,
      });
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
    // this.onMarkersChange();
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
    // baseCommonLLs

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

  basicExamples = () => {
    // .addTo(this.map)

    // L.

    // var circle = L.circle([lat, lng + 0.01], {
    //   color: 'red',
    //   fillColor: '#f03',
    //   fillOpacity: 0.5,
    //   radius: 500
    // }).addTo(this.map);

    // var polygon = L.polygon([
    // [lat, lng - 0.01],
    // [lat-0.02, lng - 0.01],
    // [lat - 0.01, lng]
    // ]).addTo(this.map);

    // marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
    // circle.bindPopup("I am a circle.");
    // polygon.bindPopup("I am a polygon.");

    const popup = L.popup();
    // .setLatLng([lat, lng])
    // .setContent("I am a standalone popup.")
    // .openOn(this.map);

    function onMapClick(e) {
      popup
        .setLatLng(e.latlng)
        .setContent(`You clicked the map at ${e.latlng.toString()}`)
        .openOn(this.map);
    }

    this.map.on('click', onMapClick.bind(this));

    // const layer = L.geoJSON(myLines(this.state), {style: myStyle}).addTo(this.map);
    // layer.addData(geojsonFeature(this.state));
    // layer.addData(myLines, {style: myStyle});
  }

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

  // getStateInfo = () => {
  //   const { dbms } = this.props;
  //   Promise.all([
  //     dbms.getSomething(),
  //   ]).then((results) => {
  //     const [something] = results;
  //     this.setState({
  //       something
  //     });
  //   });
  // }

  render() {
    const { something, lat, lng } = this.state;
    const position = [lat, lng];
    //const { t } = this.props;

    // if (!something) {
    //   return <div> Map2 stub </div>;
    //   // return null;
    // }
    //   googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
    //     maxZoom: 20,
    //     subdomains:['mt0','mt1','mt2','mt3']
    // });

    return (
      <div
        className="Map2 h-full"
        ref={map => (this.mapEl = map)}
      />
    );
  }
}
