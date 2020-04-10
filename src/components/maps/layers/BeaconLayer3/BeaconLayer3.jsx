import React, { Component } from 'react';
import './BeaconLayer3.css';

import L from 'leaflet/dist/leaflet-src';
import * as R from 'ramda';

import { CreateBeaconPopup } from '../CreateBeaconPopup';

// import { BeaconLayer3PropTypes } from '../../types';

// const sortById = R.sortBy(R.prop('id'));
const hasLatLng = (el) => !!el.lat && !!el.lng;
const getFreeBeaconIds = R.pipe(
  R.filter(R.pipe(hasLatLng, R.not)),
  R.pluck('id'),
  R.sortBy(R.identity),
);

export class BeaconLayer3 extends Component {
  // static propTypes = BeaconLayer3PropTypes;

  constructor(props) {
    super(props);
    this.state = {
      // curBeacon: null,
      newBeaconLatLng: null,
    };
    this.onCreateLayer = this.onCreateLayer.bind(this);
    // this.onRemoveLayer = this.onRemoveLayer.bind(this);
    // this.onPostLocationRecord = this.onPostLocationRecord.bind(this);
    // this.onPutLocationRecord = this.onPutLocationRecord.bind(this);
    this.onSelectBeacon = this.onSelectBeacon.bind(this);
    this.closePopup = this.closePopup.bind(this);
  }

  componentDidMount() {
    // const {
    //   gameModel, enableByDefault, layerCommunicator,
    // } = this.props;
    this.beaconPopupContainer = document.createElement('div');
    // this.subscribe('on', gameModel);
    this.communicatorSubscribe('on');
    this.createBeaconPopup = L.popup();
    // this.locationsLayer = new InnerLocationLayer3();
    // layerCommunicator.emit('setLayersMeta', {
    //   layersMeta: this.locationsLayer.getLayersMeta(),
    //   enableByDefault,
    // });
    // this.populate();
    console.log('BeaconLayer3 mounted');
  }

  componentDidUpdate() {
    // const {
    //   gameModel, translator,
    // } = this.props;
    // if (prevProps.gameModel !== gameModel) {
    //   this.subscribe('off', prevProps.gameModel);
    //   this.subscribe('on', gameModel);
    //   this.clear();
    //   this.populate();
    // }
    // if (prevProps.translator !== translator) {
    //   this.clear();
    //   this.populate();
    // }
    console.log('BeaconLayer3 did update');
  }

  componentWillUnmount() {
    // const {
    //   gameModel,
    // } = this.props;
    // this.subscribe('off', gameModel);
    this.communicatorSubscribe('off');
    // this.clear();
    console.log('BeaconLayer3 will unmount');
  }

  // // eslint-disable-next-line react/sort-comp
  // populate() {
  //   const {
  //     gameModel, t, translator,
  //   } = this.props;
  //   // this.locationsLayer.populate(gameModel, translator, t, this.setMarkerEventHandlers);
  //   this.locationsLayer.populate(gameModel, translator, this.setLocationEventHandlers, t);
  // }

  // clear() {
  //   this.locationsLayer.clear();
  // }

  // subscribe(action, gameModel) {
  //   gameModel[action]('postLocationRecord', this.onPostLocationRecord);
  //   gameModel[action]('putLocationRecord', this.onPutLocationRecord);
  // }

  // eslint-disable-next-line react/sort-comp
  communicatorSubscribe(action) {
    const { layerCommunicator } = this.props;
    // layerCommunicator[action]('highlightLocation', this.onHighlightLocation_locations);
    // layerCommunicator[action]('resetLocationHighlight', this.onResetHighlightLocation_locations);
    layerCommunicator[action]('onCreateLayer', this.onCreateLayer);
    // layerCommunicator[action]('onRemoveLayer', this.onRemoveLayer);
  }

  onCreateLayer(event) {
    const { translator, layerCommunicator } = this.props;
    if (event.layer instanceof L.Marker) {
      const beacon = event.layer;
      // // this.locationsLayer.onCreateLocation(event.layer, gameModel, translator);
      const latlng = translator.moveFrom(beacon.getLatLng());
      this.setState({
        newBeaconLatLng: latlng,
      });
      console.log(latlng);
      layerCommunicator.emit('openPopup', {
        popup: this.createBeaconPopup.setLatLng(latlng).setContent(this.beaconPopupContainer),
      });
      // gameModel.execute({
      //   type: 'postLocationRecord',
      //   props: { polygon: latlngs.latlngs },
      // });
      beacon.remove();
    }
  }

  // onPostLocationRecord({ locationRecord }) {
  //   const { t } = this.props;
  //   this.locationsLayer.onPostLocationRecord(locationRecord, this.setLocationEventHandlers, t);
  // }

  // onPutLocationRecord({ locationRecord }) {
  //   // const { t } = this.props;
  //   this.locationsLayer.onPutLocationRecord(locationRecord);
  // }

  // onRemoveLayer(event) {
  //   const {
  //     gameModel, translator, closePopup, layerCommunicator,
  //   } = this.props;
  //   if (event.layer instanceof L.Polygon) {
  //     // this.markerLayer.onRemoveMarker(event.layer, gameModel, translator, this.setMarkerEventHandlers);
  //     this.locationsLayer.onRemoveLocation(event.layer, gameModel);
  //     layerCommunicator.emit('closePopup');
  //   }
  // }

  // setLocationEventHandlers = (location) => {
  //   location.on({
  //     click: this.onLocationClick,
  //     //   mouseover: this.highlightLocation,
  //     //   mouseout: this.resetLocationHighlight,
  //     'pm:edit': this.onLocationEdit,
  //   });
  //   return location;
  // }

  // // highlightLocation = (e) => {
  // //   const { layerCommunicator } = this.props;
  // //   const layer = e.target;
  // //   layerCommunicator.emit('highlightLocation', { location: layer });
  // // }

  // onLocationClick = (e) => {
  //   const { layerCommunicator } = this.props;
  //   const {
  //     label, id, markers, manaLevel,
  //   } = e.target.options;
  //   this.setState({
  //     curLocation: {
  //       id,
  //       label,
  //       markers,
  //       manaLevel,
  //     },
  //   });
  //   layerCommunicator.emit('openPopup', {
  //     popup: this.locationPopup.setLatLng(e.latlng).setContent(this.locationPopupDom),
  //   });
  // }

  // onLocationEdit = (e) => {
  //   const {
  //     gameModel, translator, layerCommunicator,
  //   } = this.props;
  //   const location = e.target;
  //   const latlngs = translator.moveFrom({
  //     latlngs: location.getLatLngs(),
  //   });
  //   gameModel.execute({
  //     type: 'putLocationRecord',
  //     id: location.options.id,
  //     props: {
  //       polygon: latlngs.latlngs,
  //     },
  //   });
  //   this.closePopup();
  // }

  // eslint-disable-next-line class-methods-use-this
  closePopup() {
    const {
      layerCommunicator,
    } = this.props;
    layerCommunicator.emit('closePopup');
  }

  onSelectBeacon(latLng, id) {
    const {
      gameModel,
    } = this.props;
    // layerCommunicator.emit('closePopup');
    this.setState({
      newBeaconLatLng: null,
    });
    gameModel.execute({
      type: 'putBeaconRecord',
      id,
      props: {
        ...latLng,
      },
    });
    this.closePopup();
  }

  // // resetLocationHighlight = () => {
  // //   const { layerCommunicator } = this.props;
  // //   layerCommunicator.emit('resetLocationHighlight');
  // // }

  // // onHighlightLocation_locations({ location }) {
  // //   location.setStyle({
  // //     weight: 5,
  // //     color: 'green',
  // //     dashArray: '',
  // //     fillOpacity: 1,
  // //   });
  // // }

  // // onResetHighlightLocation_locations() {
  // //   this.locationsLayer.updateLocationsView();
  // // }

  // // onLocMarkerChange = ({ action, markerId }) => {
  // //   const { gameModel } = this.props;
  // //   const locId = this.state.curLocation.id;
  // //   const props = this.locationsLayer.onLocMarkerChange(action, markerId, gameModel, locId);

  // //   this.setState((state) => {
  // //     const curLocation = { ...state.curLocation, markers: props.markers };
  // //     return ({
  // //       curLocation,
  // //     });
  // //   });
  // // }

  // onLocationChange = (prop) => (e) => {
  //   const { value } = e.target;
  //   const { gameModel } = this.props;
  //   const { id } = this.state.curLocation;
  //   this.locationsLayer.onLocationChange(prop, value, gameModel, id);
  //   this.setState((state) => {
  //     const curLocation = { ...state.curLocation, [prop]: value };
  //     return ({
  //       curLocation,
  //     });
  //   });
  //   // this.locationsLayer.updateLocationsView();
  // }

  getCreateBeaconPopup() {
    const {
      newBeaconLatLng,
    } = this.state;
    const {
      gameModel,
    } = this.props;
    if (!newBeaconLatLng) {
      return null;
    }
    const freeBeaconIds = getFreeBeaconIds(gameModel.get('beaconRecords'));
    return (
      <CreateBeaconPopup

        // label={curLocation.label}
        // id={curLocation.id}
        // manaLevel={curLocation.manaLevel}
        // attachedMarkers={curLocation.markers}
        // allBeacons={allBeacons}
        // allLocations={allLocations}
        // onChange={this.onLocationChange}
        // onLocMarkerChange={this.onLocMarkerChange}
        latLng={newBeaconLatLng}
        freeBeaconIds={freeBeaconIds}
        onSelect={this.onSelectBeacon}
        onClose={this.closePopup}
        domContainer={this.beaconPopupContainer}
      />
    );
  }

  render() {
    // return null;
    return (
      <>
        {
          // this.getLocationPopup()
          this.getCreateBeaconPopup()
        }
      </>
    );
  }
}
