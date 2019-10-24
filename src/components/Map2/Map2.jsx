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


import { getBeacons } from '../../data/beacons';

import { baseClosedLLs, baseLLs, baseCommonLLs } from '../../data/baseContours';

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
    curMarker: null
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

  onCreate = event => {
    if (event.layer instanceof L.Marker) {
      const marker = event.layer;
      const geo = marker.toGeoJSON();
      this.map.removeLayer(marker);

      const marker2 = L.geoJSON(geo).getLayers()[0];
      getGeoProps(marker2).name = shortid.generate();
      this.markerGroup.addLayer(marker2);

      marker2.on('pm:edit', () => this.onMarkerEdit());

      this.addMarkerOnClick(marker2);
      this.onMarkersChange();
    } else {
      this.locationsGroup.addLayer(event.layer);
      event.layer.on('pm:edit', () => this.saveLocations());
      this.saveLocations();
    }
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

    this.markerPopup = L.popup();
    const markers = this.getMarkers(beacons);

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
      this.addMarkerOnClick(marker);
      // const text = JSON.stringify(getGeoProps(marker), null, '  ');
      // marker.bindPopup(text);
      marker.on('pm:edit', () => this.onMarkerEdit());
    });
    return markers;
  }

  addMarkerOnClick = marker => {
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

  onMarkerChange = prop => e => {
    const { value } = e.target;
    // eslint-disable-next-line react/destructuring-assignment
    const { name } = this.state.curMarker;
    const marker = this.markerGroup.getLayers().find(marker2 => getGeoProps(marker2).name === name);
    if (prop === 'name') {
      getGeoProps(marker).name = value;
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
      // getGeoProps(marker).name = value;
    }
    this.saveMarkers();
    this.setState(state => {
      const curMarker = { ...state.curMarker, [prop]: value };
      return ({
        curMarker
      });
    });
  }

  closeMarkerPopup = () => {
    // this.markerPopup.closePopup();
    this.map.closePopup();
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

  // eslint-disable-next-line max-lines-per-function
  render() {
    const {
      something, lat, lng, curMarker
    } = this.state;
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

    return (
      <>
        <div
          className="Map2 h-full"
          ref={map => (this.mapEl = map)}
        />
        <div ref={markerPopup => (this.markerPopupContent = markerPopup)}>{el}</div>
      </>
    );
  }
}
