import React, { Component } from 'react';
import './BackgroundImageLayer.css';

import L from 'leaflet/dist/leaflet-src';
import * as R from 'ramda';

import { InnerBackgroundImageLayer } from './InnerBackgroundImageLayer';

// import { BackgroundImageLayerPropTypes } from '../../types';

export class BackgroundImageLayer extends Component {
  // static propTypes = BackgroundImageLayerPropTypes;

  constructor(props) {
    super(props);
    this.state = {
      curBackgroundImage: null,
    };
    this.onCreateLayer = this.onCreateLayer.bind(this);
    this.onRemoveLayer = this.onRemoveLayer.bind(this);
    this.setRectangleEventHandlers = this.setRectangleEventHandlers.bind(this);
    this.onRectangleEdit = this.onRectangleEdit.bind(this);
  }

  componentDidMount() {
    const {
      gameModel, enableByDefault, layerCommunicator,
    } = this.props;
    this.communicatorSubscribe('on');
    // this.locationPopup = L.popup();
    this.imageLayer = new InnerBackgroundImageLayer();
    layerCommunicator.emit('setLayersMeta', {
      layersMeta: this.imageLayer.getLayersMeta(),
      enableByDefault,
    });
    this.populate();
    console.log('BackgroundImageLayer mounted');
  }

  componentDidUpdate(prevProps) {
    const {
      gameModel, translator,
    } = this.props;
    if (prevProps.gameModel !== gameModel) {
      this.clear();
      this.populate();
    }
    if (prevProps.translator !== translator) {
      this.clear();
      this.populate();
    }
    console.log('BackgroundImageLayer did update');
  }

  componentWillUnmount() {
    const {
      gameModel,
    } = this.props;
    this.communicatorSubscribe('off');
    // this.clear();
    console.log('BackgroundImageLayer will unmount');
  }

  // eslint-disable-next-line react/sort-comp
  populate() {
    const {
      gameModel, t, translator,
    } = this.props;
      // this.imageLayer.populate(gameModel, translator, t, this.setMarkerEventHandlers);
    // this.imageLayer.populate(gameModel, translator, this.setLocationEventHandlers, t);
    this.imageLayer.populate(gameModel, translator, this.setRectangleEventHandlers);
  }

  clear() {
    this.imageLayer.clear();
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
    if (event.layer instanceof L.Rectangle) {
      console.log('rectangle created');
      // this.imageLayer.onCreateImage(event.layer, gameModel, translator, this.setLocationEventHandlers);
      this.imageLayer.onCreateImage(event.layer, gameModel, translator, this.setRectangleEventHandlers);
    }
  }

  onRemoveLayer(event) {
    const {
      gameModel, translator, closePopup, layerCommunicator,
    } = this.props;
    if (event.layer instanceof L.Rectangle) {
      console.log('rectangle removed');
      // this.markerLayer.onRemoveMarker(event.layer, gameModel, translator, this.setMarkerEventHandlers);
      // this.imageLayer.onRemoveLocation(event.layer, gameModel);
      this.imageLayer.onRemoveImage(event.layer, gameModel);
      layerCommunicator.emit('closePopup');
    }
  }

  setRectangleEventHandlers = (rect) => {
    rect.on({
      // click: this.onLocationClick,
      // mouseover: this.highlightLocation,
      // mouseout: this.resetLocationHighlight,
      'pm:edit': this.onRectangleEdit,
    });
  }

  //   onLocationClick = (e) => {
  //     const { layerCommunicator } = this.props;
  //     const {
  //       name, id, markers, manaLevel,
  //     } = e.target.options;
  //     this.setState({
  //       curLocation: {
  //         id,
  //         name,
  //         markers,
  //         manaLevel,
  //       },
  //     });
  //     layerCommunicator.emit('openPopup', {
  //       popup: this.locationPopup.setLatLng(e.latlng).setContent(locationPopupDom),
  //     });
  //   }

  onRectangleEdit = (e) => {
    const {
      gameModel, translator, closePopup, layerCommunicator,
    } = this.props;
    const rectangle = e.target;
    gameModel.execute({
      type: 'putBackgroundImage',
      id: rectangle.options.id,
      props: {
        ...translator.moveFrom({
          latlngs: rectangle.getLatLngs(),
        }),
      },
    });
    layerCommunicator.emit('closePopup');
  }


  //   onLocationChange = (prop) => (e) => {
  //     const { value } = e.target;
  //     const { gameModel } = this.props;
  //     const { id } = this.state.curLocation;
  //     this.imageLayer.onLocationChange(prop, value, gameModel, id);
  //     this.setState((state) => {
  //       const curLocation = { ...state.curLocation, [prop]: value };
  //       return ({
  //         curLocation,
  //       });
  //     });
  //     this.imageLayer.updateLocationsView();
  //   }

  //   getLocationPopup() {
  //     const {
  //       curLocation,
  //     } = this.state;
  //     const {
  //       gameModel,
  //     } = this.props;
  //     if (!curLocation) {
  //       return null;
  //     }
  //     const allBeacons = R.clone(gameModel.get('beacons'));
  //     const allLocations = R.clone(gameModel.get('locations'));
  //     return (
  //       <LocationPopup
  //         name={curLocation.name}
  //         id={curLocation.id}
  //         manaLevel={curLocation.manaLevel}
  //         attachedMarkers={curLocation.markers}
  //         allBeacons={allBeacons}
  //         allLocations={allLocations}
  //         onChange={this.onLocationChange}
  //         onLocMarkerChange={this.onLocMarkerChange}
  //         onClose={this.closePopup}
  //       />
  //     );
  //   }

  render() {
    return null;
    // return (
    //   <>
    //     {
    //       this.getLocationPopup()
    //     }
    //   </>
    // );
  }
}
