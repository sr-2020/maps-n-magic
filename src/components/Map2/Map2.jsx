import React, { Component } from 'react';
import './Map2.css';
import * as R from 'ramda';

import "../../utils/gpxConverter";

import 'leaflet/dist/leaflet-src.js';
import 'leaflet/dist/leaflet.css';

import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

import L from "leaflet";
import { getBeacons } from "../../data/beacons";

import { getPolygons, getPolygons2 } from '../../utils/polygonGenerator';

import { getBoundingRect, scaleRect } from '../../utils/polygonUtils';

import ColorPalette from '../../utils/colorPalette';

import { Map, TileLayer, Marker, Popup } from "react-leaflet";
console.log(L);
L.Icon.Default.imagePath = './images/leafletImages/';


const beacons = getBeacons();

// 
// const minZoom = 14;
const maxZoom = 20;
const minZoom = null;

var geojsonFeature = ({lng,lat}) => ({
  "type": "Feature",
  "properties": {
    "name": "Coors Field",
    "amenity": "Baseball Stadium",
    "popupContent": "This is where the Rockies play!"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [lng, lat]
  }
});


var myStyle = {
  // "color": "#ff7800",
  "color": "#ff0000",
  "weight": 5,
  "opacity": 0.65
};

var myLines = ({lng,lat}) => [{
  "type": "LineString",
  "coordinates": 
  [[lng, lat - 0.005],
  [lng-0.01, lat - 0.005],
  [lng - 0.005, lat]]
// }, {
//   "type": "LineString",
//   "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
}];

var baseClosedLLs = [
  [36.8720195,54.9296674],
  [36.8720624,54.9285209],
  [36.873028,54.9285393],
  [36.8730924,54.9282496],
  [36.8742725,54.9282064],
  [36.874294,54.9293469],
  [36.8741223,54.9300065],
  [36.8727598,54.9304504],
  [36.8723843,54.9296675],
  [36.8720195,54.9296674]
].map(R.reverse);

var baseLLs = [
  [36.8706891,54.9300497],
  [36.8683717,54.9279968],
  [36.873382,54.9265912],
  [36.8744442,54.9274728],
  [36.8724486,54.9278242],
  [36.8724593,54.9284284],
  [36.8720946,54.9284284],
  [36.8720195,54.9296674],
  [36.8710324,54.9300682],
  [36.8706891,54.9300497],
].map(R.reverse);

var baseCommonLLs = [
  [36.8706891,54.9300497],
  [36.8683717,54.9279968],
  [36.873382,54.9265912],
  [36.8744442,54.9274728],
  [36.8724486,54.9278242],
  [36.8724593,54.9284284],
  [36.8720946,54.9284284],
  // [36.8720195,54.9296674],

  // [36.8720195,54.9296674],
  [36.8720624,54.9285209],
  [36.873028,54.9285393],
  [36.8730924,54.9282496],
  [36.8742725,54.9282064],
  [36.874294,54.9293469],
  [36.8741223,54.9300065],
  [36.8727598,54.9304504],
  [36.8723843,54.9296675],
  [36.8720195,54.9296674],

  [36.8710324,54.9300682],
  [36.8706891,54.9300497],
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
    // zoom: 17,
    zoom: 16,
  }

  componentDidMount = () => {
    console.log('Map2 mounted');
    const {lat, lng, zoom} = this.state;
    const map = this.map = L.map(this.mapEl, {
      center: [lat, lng],
      zoom,
      // minZoom
    })
    // .setView([lat, lng], zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      maxZoom,
      id: 'mapbox.streets',
      accessToken: 'your.mapbox.access.token'
    }).addTo(this.map);

    // var marker = L.marker([lat, lng]).addTo(this.map);
    // var marker = L.marker([lat, lng]);
    // marker.addTo(this.map);
    
    var baseLine = L.polyline(baseLLs, {color: 'green'});

    var baseClosedLine = L.polyline(baseClosedLLs, {color: 'red'});
    const baseContourGroup = L.layerGroup([baseLine, baseClosedLine]);
    
    // baseLine.addTo(this.map);
    // baseClosedLine.addTo(this.map);

    const markers = beacons.map(beacon => L.geoJSON(beacon));
    const markerGroup = L.layerGroup(markers);
    



    

    const bRect1 = (getBoundingRect(baseCommonLLs));
    const bRect = scaleRect(bRect1, 1.1);
    console.log('baseCommonLLs', baseCommonLLs, bRect1, bRect);

    const boundingPolyline = L.polyline([
      [bRect.top, bRect.left],
      [bRect.top, bRect.right],
      [bRect.bottom, bRect.right],
      [bRect.bottom, bRect.left],
      [bRect.top, bRect.left],
    ], {color: 'blue'});
    boundingPolyline.addTo(this.map);

    const plainPoints = beacons.map(beacon => ({
      x: beacon.geometry.coordinates[1],
      y: beacon.geometry.coordinates[0]
    }));
    console.log('plainPoints',plainPoints);
    const polygonData = getPolygons2(plainPoints, 
      [bRect.bottom, bRect.left, bRect.top, bRect.right]
    // , null);
    , baseCommonLLs);
    // baseCommonLLs



    const polygons = polygonData.clippedPolygons.map((polygon, i) => 
      L.polygon(polygon, {
        fillColor: ColorPalette[i % ColorPalette.length].color.background,
        fillOpacity: 0.5
        // color: ColorPalette[i % ColorPalette.length].color.background
        // || ColorPalette[i % ColorPalette.length].color.background || 'none'
      }));
    const polygonsGroup = L.layerGroup(polygons);
    // polygons.forEach(polygon => polygon.addTo(this.map));

    const signalRadiuses = beacons.map((beacon, i) => 
      // L.circleMarker([
      L.circle([
        beacon.geometry.coordinates[1],
        beacon.geometry.coordinates[0]
      ], {
        radius: 13
      })
    );
    const signalRadiusesGroup = L.layerGroup(signalRadiuses);

    const massCenters = polygonData.clippedCenters.map((massCenter, i) => 
      L.circleMarker([massCenter.x, massCenter.y], {
        radius: 5
      })
    );
    const massCentersGroup = L.layerGroup(massCenters);

    markerGroup.addTo(this.map);
    baseContourGroup.addTo(this.map);
    polygonsGroup.addTo(this.map);
    massCentersGroup.addTo(this.map);

    const overlayMaps = {
      "Base contour": baseContourGroup,
      "Markers": markerGroup,
      "Mass centers": massCentersGroup,
      "Voronoi polygons": polygonsGroup,
      "Signal radiuses": signalRadiusesGroup
    };

    L.control.layers(null, overlayMaps).addTo(this.map);

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

    var popup = L.popup()
    // .setLatLng([lat, lng])
    // .setContent("I am a standalone popup.")
    // .openOn(this.map);
    
    function onMapClick(e) {
      popup
      .setLatLng(e.latlng)
      .setContent("You clicked the map at " + e.latlng.toString())
      .openOn(this.map);
    }
    
    this.map.on('click', onMapClick.bind(this));


    // const layer = L.geoJSON(myLines(this.state), {style: myStyle}).addTo(this.map);
    // layer.addData(geojsonFeature(this.state));
    // layer.addData(myLines, {style: myStyle});

    

    this.map.pm.addControls({
      position: 'topleft',
      drawCircleMarker: false,
      drawPolyline: false,
      cutPolygon: false
      // drawCircle: false,
    });

    this.map.on('pm:create', (...args) => {
      console.log(args);
      // workingLayer.on('pm:vertexadded', e => {
      //   console.log(e);
      // });
    });
 
    // this.getStateInfo();
  }

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
    const { something } = this.state;
    const position = [this.state.lat, this.state.lng]
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
      <div className="Map2 h-full"
      ref={map => (this.mapEl = map)}>
        {/* <Map className="fullscreen-map h-full"  center={position} zoom={this.state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          <Marker position={position}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </Map> */}
      </div>
    );
  }
}
