import React, { Component } from 'react';
import './Map2.css';

import 'leaflet/dist/leaflet-src.js';
import 'leaflet/dist/leaflet.css';

import L from "leaflet";

import { Map, TileLayer, Marker, Popup } from "react-leaflet";
console.log(L);
L.Icon.Default.imagePath = './images/leafletImages/';


export default class Map2 extends Component {
  state = {
    lat: 54.928743,
    lng: 36.871746,
    zoom: 15,
  }

  componentDidMount = () => {
    console.log('Map2 mounted');
    const {lat, lng, zoom} = this.state;
    this.map = L.map(this.mapEl).setView([lat, lng], zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: 'your.mapbox.access.token'
    }).addTo(this.map);

    var marker = L.marker([lat, lng]).addTo(this.map);

    var circle = L.circle([lat, lng + 0.01], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 500
    }).addTo(this.map);

    var polygon = L.polygon([
      [lat, lng - 0.01],
      [lat-0.02, lng - 0.01],
      [lat - 0.01, lng]
    ]).addTo(this.map);

    marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
circle.bindPopup("I am a circle.");
polygon.bindPopup("I am a polygon.");

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
