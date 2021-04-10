import React, { Component } from 'react';
import './LocationLayer4.css';

import { 
  L, 
  CommonLayerProps,
  OnCreateLayerEvent,
  OnRemoveLayerEvent 
} from "sr2020-mm-client-core";
import { GameModel, LocationRecord } from "sr2020-mm-event-engine";
// import * as R from 'ramda';

import { LocationPopup3, EditableLocFields } from './LocationPopup3';
import { InnerLocationLayer, InnerLocationLayerProps } from './InnerLocationLayer';

type LocPropChange = 
  { prop: 'label', value: string } |
  { prop: 'layer_id', value: number } |
  { prop: 'color', value: string } |
  { prop: 'fillOpacity', value: number } |
  { prop: 'weight', value: number };

interface LocationLayer4Props extends CommonLayerProps, InnerLocationLayerProps {
  gameModel: GameModel;
  editable: boolean;
}
interface LocationLayer4State {
  curLocation: {
    id: number;
    label: string;
    layer_id: number;
    // from LocationRecordOptions
    color: string;
    weight: number;
    fillOpacity: number;
    // manaLevel: number;
  };
}

export class LocationLayer4 extends Component<
  LocationLayer4Props,
  LocationLayer4State
> {
  locationPopupDom: HTMLElement;

  locationPopup: L.Popup;

  constructor(props: LocationLayer4Props) {
    super(props);
    this.state = {
      curLocation: null,
    };
    this.onCreateLayer = this.onCreateLayer.bind(this);
    this.onRemoveLayer = this.onRemoveLayer.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.onLocationClick = this.onLocationClick.bind(this);
    this.onLocationEdit = this.onLocationEdit.bind(this);
    this.onLocationChange = this.onLocationChange.bind(this);
  }

  componentDidMount() {
    this.locationPopupDom = document.createElement('div');
    this.communicatorSubscribe('on');
    this.locationPopup = L.popup();
    // console.log('LocationLayer4 mounted');
  }

  componentDidUpdate() {
    // console.log('LocationLayer4 did update');
  }

  componentWillUnmount() {
    this.communicatorSubscribe('off');
    // console.log('LocationLayer4 will unmount');
  }

  communicatorSubscribe(action: 'on'|'off') {
    const { layerCommunicator } = this.props;
    layerCommunicator[action]('onCreateLayer', this.onCreateLayer);
    layerCommunicator[action]('onRemoveLayer', this.onRemoveLayer);
  }

  onCreateLayer(event: OnCreateLayerEvent) {
    const { gameModel, translator } = this.props;
    if (event.layer instanceof L.Polygon) {
      const location = event.layer;
      // @ts-ignore
      const latlngs = translator.moveFrom({
        latlngs: location.getLatLngs(),
      });
      gameModel.execute({
        type: 'postLocationRecord',
        // @ts-ignore
        props: { polygon: latlngs.latlngs },
      });
      location.remove();
    }
  }

  onRemoveLayer(event: OnRemoveLayerEvent) {
    const {
      gameModel, layerCommunicator,
    } = this.props;
    if (event.layer instanceof L.Polygon) {
      const location = event.layer;
      gameModel.execute({
        type: 'deleteLocationRecord',
        id: location.options.id,
      });
      layerCommunicator.emit('closePopup');
    }
  }

  onLocationClick(e: L.LeafletMouseEvent) {
    const { layerCommunicator, editable } = this.props;
    if (!editable) {
      return;
    }
    const {
      label, id, layer_id, color, weight, fillOpacity,
    } = e.target.options;
    this.setState({
      curLocation: {
        id,
        label,
        // markers,
        // manaLevel,
        layer_id,
        color,
        weight,
        fillOpacity,
      },
    });
    layerCommunicator.emit('openPopup', {
      popup: this.locationPopup.setLatLng(e.latlng).setContent(this.locationPopupDom),
    });
  }

  onLocationEdit(e: L.LeafletEvent) {
    const {
      gameModel, translator, layerCommunicator, editable,
    } = this.props;
    if (!editable) {
      return;
    }
    const location = e.target;
    const latlngs = translator.moveFrom({
      latlngs: location.getLatLngs(),
    });
    gameModel.execute({
      type: 'putLocationRecord',
      id: location.options.id,
      props: {
        polygon: latlngs.latlngs,
      },
    });
    this.closePopup();
  }

  closePopup() {
    const {
      layerCommunicator,
    } = this.props;
    layerCommunicator.emit('closePopup');
  }

  onLocationChange(prop: EditableLocFields) {
    return (e: {target: {value: string}}) => {
      const { value } = e.target;
      const { gameModel, editable } = this.props;
      if (!editable) {
        return;
      }
      const { id } = this.state.curLocation;
      if (prop === 'weight') {
        const value2 = Number(value);
        if (value2 < 0 || value2 > 20) {
          return;
        }
        this.onLocationChange2({prop, value: value2});
      } else if (prop === 'fillOpacity') {
        let value2 = Number(value);
        if (value2 < 0 || value2 > 100) {
          return;
        }
        value2 = 1 - value2 / 100;
        this.onLocationChange2({prop, value: value2});
      } else if (prop === 'layer_id') {
        const value2 = Number(value);
        this.onLocationChange2({prop, value: value2});
      } else {
        this.onLocationChange2({prop, value});
      }
      this.setState((state) => {
        const curLocation = { ...state.curLocation, [prop]: value };
        return ({
          curLocation,
        });
      });
    }
  } 

  onLocationChange2({prop, value}: LocPropChange) {
    const { gameModel } = this.props;
    const { id } = this.state.curLocation;
    if (prop === 'label') {
      gameModel.execute({
        type: 'putLocationRecord',
        id,
        props: {
          [prop]: value,
        },
      });
    }
    if (prop === 'layer_id') {
      gameModel.execute({
        type: 'putLocationRecord',
        id,
        props: {
          [prop]: value,
        },
      });
    }
    if (prop === 'weight' || prop === 'fillOpacity' || prop === 'color') {
      const locationRecord = gameModel.get<LocationRecord>({
        type: 'locationRecord',
        id,
      });
      gameModel.execute({
        type: 'putLocationRecord',
        id,
        props: {
          options: {
            ...locationRecord.options,
            [prop]: value,
          },
        },
      });
    }
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
    return (
      <LocationPopup3
        label={curLocation.label}
        // id={curLocation.id}
        layer_id={curLocation.layer_id}
        color={curLocation.color}
        weight={curLocation.weight}
        fillOpacity={curLocation.fillOpacity}
        // manaLevel={curLocation.manaLevel}
        // attachedMarkers={curLocation.markers}
        // allBeacons={allBeacons}
        // allLocations={allLocations}
        onChange={this.onLocationChange}
        // onLocMarkerChange={this.onLocMarkerChange}
        onClose={this.closePopup}
        locationPopupDom={this.locationPopupDom}
      />
    );
  }

  render() {
    return (
      <>
        <InnerLocationLayer
          onLocationClick={this.onLocationClick}
          onLocationEdit={this.onLocationEdit}
          {...this.props}
        />
        {
          this.getLocationPopup()
        }
      </>
    );
  }
}
