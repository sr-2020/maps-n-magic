import React, { Component } from 'react';
import './LocationLayer3.css';

import L from 'leaflet/dist/leaflet-src';
import * as R from 'ramda';

import { InnerLocationLayer3 } from './InnerLocationLayer3';

import { locationPopupDom } from '../../../../utils/domUtils';

import { LocationPopup } from '../LocationPopup';

// import { LocationLayer3PropTypes } from '../../types';

export class LocationLayer3 extends Component {
  // static propTypes = LocationLayer3PropTypes;

  constructor(props) {
    super(props);
    this.state = {
      curLocation: null,
    };
    // this.onRemoveBeacon = this.onRemoveBeacon.bind(this);
    this.onHighlightLocation_locations = this.onHighlightLocation_locations.bind(this);
    this.onResetHighlightLocation_locations = this.onResetHighlightLocation_locations.bind(this);
    this.onCreateLayer = this.onCreateLayer.bind(this);
    this.onRemoveLayer = this.onRemoveLayer.bind(this);
    this.closePopup = this.closePopup.bind(this);
  }

  componentDidMount() {
    const {
      gameModel, enableByDefault, layerCommunicator,
    } = this.props;
    this.subscribe('on', gameModel);
    this.communicatorSubscribe('on');
    this.locationPopup = L.popup();
    this.locationsLayer = new InnerLocationLayer3();
    layerCommunicator.emit('setLayersMeta', {
      layersMeta: this.locationsLayer.getLayersMeta(),
      enableByDefault,
    });
    this.populate();
    console.log('LocationLayer3 mounted');
  }

  componentDidUpdate(prevProps) {
    const {
      gameModel, translator,
    } = this.props;
    if (prevProps.gameModel !== gameModel) {
      this.subscribe('off', prevProps.gameModel);
      this.subscribe('on', gameModel);
      this.clear();
      this.populate();
    }
    if (prevProps.translator !== translator) {
      this.clear();
      this.populate();
    }
    console.log('LocationLayer3 did update');
  }

  componentWillUnmount() {
    const {
      gameModel,
    } = this.props;
    this.subscribe('off', gameModel);
    this.communicatorSubscribe('off');
    this.clear();
    console.log('LocationLayer3 will unmount');
  }

  // eslint-disable-next-line react/sort-comp
  populate() {
    const {
      gameModel, t, translator,
    } = this.props;
    // this.locationsLayer.populate(gameModel, translator, t, this.setMarkerEventHandlers);
    this.locationsLayer.populate(gameModel, translator, this.setLocationEventHandlers, t);
  }

  clear() {
    this.locationsLayer.clear();
  }

  subscribe(action, gameModel) {
    // gameModel[action]('deleteBeacon', this.onRemoveBeacon);
  }

  communicatorSubscribe(action) {
    const { layerCommunicator } = this.props;
    // layerCommunicator[action]('highlightLocation', this.onHighlightLocation_locations);
    // layerCommunicator[action]('resetLocationHighlight', this.onResetHighlightLocation_locations);
    layerCommunicator[action]('onCreateLayer', this.onCreateLayer);
    layerCommunicator[action]('onRemoveLayer', this.onRemoveLayer);
  }

  onCreateLayer(event) {
    const { gameModel, translator } = this.props;
    if (event.layer instanceof L.Polygon) {
      this.locationsLayer.onCreateLocation(event.layer, gameModel, translator, this.setLocationEventHandlers);
    }
  }

  onRemoveLayer(event) {
    const {
      gameModel, translator, closePopup, layerCommunicator,
    } = this.props;
    if (event.layer instanceof L.Polygon) {
      // this.markerLayer.onRemoveMarker(event.layer, gameModel, translator, this.setMarkerEventHandlers);
      this.locationsLayer.onRemoveLocation(event.layer, gameModel);
      layerCommunicator.emit('closePopup');
    }
  }

  // onRemoveBeacon({ beacon }) {
  //   const { gameModel } = this.props;
  //   this.locationsLayer.removeMarkerFromLocations(beacon.id, gameModel);
  //   this.locationsLayer.updateLocationsView();
  // }

  setLocationEventHandlers = (location) => {
    // location.on({
    //   click: this.onLocationClick,
    //   mouseover: this.highlightLocation,
    //   mouseout: this.resetLocationHighlight,
    //   'pm:edit': this.onLocationEdit,
    // });
  }

  highlightLocation = (e) => {
    const { layerCommunicator } = this.props;
    const layer = e.target;
    layerCommunicator.emit('highlightLocation', { location: layer });
  }

  onLocationClick = (e) => {
    const { layerCommunicator } = this.props;
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
    layerCommunicator.emit('openPopup', {
      popup: this.locationPopup.setLatLng(e.latlng).setContent(locationPopupDom),
    });
  }

  onLocationEdit = (e) => {
    const {
      gameModel, translator, layerCommunicator,
    } = this.props;
    const location = e.target;
    gameModel.execute({
      type: 'putLocation',
      id: location.options.id,
      props: {
        ...translator.moveFrom({
          latlngs: location.getLatLngs(),
        }),
      },
    });
    this.closePopup();
  }

  // eslint-disable-next-line class-methods-use-this
  closePopup() {
    const {
      layerCommunicator,
    } = this.props;
    layerCommunicator.emit('closePopup');
  }

  resetLocationHighlight = () => {
    const { layerCommunicator } = this.props;
    layerCommunicator.emit('resetLocationHighlight');
  }

  onHighlightLocation_locations({ location }) {
    location.setStyle({
      weight: 5,
      color: 'green',
      dashArray: '',
      fillOpacity: 1,
    });
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
      null
      // <LocationPopup
      //   name={curLocation.name}
      //   id={curLocation.id}
      //   manaLevel={curLocation.manaLevel}
      //   attachedMarkers={curLocation.markers}
      //   allBeacons={allBeacons}
      //   allLocations={allLocations}
      //   onChange={this.onLocationChange}
      //   onLocMarkerChange={this.onLocMarkerChange}
      //   onClose={this.closePopup}
      // />
    );
  }


  render() {
    return (
      <>
        {
          this.getLocationPopup()
        }
      </>
    );
  }
}
