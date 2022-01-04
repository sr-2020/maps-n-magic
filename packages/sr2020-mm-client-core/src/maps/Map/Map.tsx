// eslint-disable-next-line max-classes-per-file
import { WithTranslation } from 'react-i18next';
import React, { Component } from 'react';
import * as R from 'ramda';

// import '../../../utils/gpxConverter';
import { EventEmitter } from 'events';

import { leafletI18n, defaultLang } from 'sr2020-mm-translations';

import { L } from "../../misc/leafletWrapper";

import { 
  LayerCommunicator, 
  OnCreateLayerEvent,
  OnRemoveLayerEvent,
  SetLayersMetaEvent,
  OpenPopupEvent,
  RemoveLayersMetaEvent
} from "../../../index";

import { Translator } from "../../utils/Translator";

// eslint-disable-next-line import/extensions
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.js';
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css';

import './Map.css';

import { LayersMeta } from "../../types";

import { WithMapDefaults } from '../../misc/withMapDefaults';
import { WithTranslator } from '../../misc/withTranslator';

// console.log(L);
L.Icon.Default.imagePath = './images/leafletImages/';

interface MapProps extends WithTranslation, WithMapDefaults, WithTranslator {
  geomanConfig: L.PM.DrawControlOptions;
  commonPropsExtension: object;
}
interface MapState {
  // map: L.Map;
}

export class Map extends Component<MapProps, MapState> {
  layerCommunicator: LayerCommunicator;

  map: L.Map;

  layerControl: L.Control.Layers;

  mapEl: HTMLElement | null;

  locateControl: any = undefined;

  constructor(props: MapProps) {
    super(props);
    this.state = {
      // map: null,
    };
    this.openPopup = this.openPopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.setLayersMeta = this.setLayersMeta.bind(this);
    this.removeLayersMeta = this.removeLayersMeta.bind(this);
    this.onLocateControl = this.onLocateControl.bind(this);
    // this.addToMap = this.addToMap.bind(this);
  }

  // eslint-disable-next-line max-lines-per-function
  componentDidMount(): void {
    const {
      geomanConfig, mapDefaults,
    } = this.props;

    this.layerCommunicator = new EventEmitter();

    // @ts-ignore
    this.map = L.map(this.mapEl, {
      center: mapDefaults?.defaultCenter,
      zoom: mapDefaults?.defaultZoom,
      zoomControl: false,
    });

    L.control.zoom({
      ...leafletI18n[defaultLang].getZoomTranslation(),
      position: 'topleft',
    }).addTo(this.map);

    this.layerControl = L.control.layers();
    this.layerControl.addTo(this.map);

    if (geomanConfig) {
      this.map.pm.addControls(geomanConfig);
      leafletI18n[defaultLang].applyLeafletGeomanTranslation(this.map);
      // applyZoomTranslation(this.map);

      this.map.on('pm:create', this.onCreateLayer);
      this.map.on('pm:remove', this.onRemoveLayer);
    }

    this.setState({
      map: this.map,
    });

    this.communicatorSubscribe('on');

    // Interesting object which can be used to draw position with arrow
    // L.Control.Locate.prototype.options.compassClass

    // this.map.pm.toggleGlobalDragMode();
  }

  componentDidUpdate(prevProps: MapProps): void {
    const {
      translator, mapDefaults,
    } = this.props;
    if (prevProps.translator !== translator) {
      const newCenter = translator?.getVirtualCenter() || mapDefaults?.defaultCenter;
      if(newCenter) {
        this.map.panTo(newCenter);
        console.log('position changed');
      }
    }
    // console.log('Map did update');
  }

  componentWillUnmount(): void {
    this.communicatorSubscribe('off');
  }

  onCreateLayer = (event: OnCreateLayerEvent): void => {
    this.layerCommunicator.emit('onCreateLayer', event);
    console.log('TODO fix type in Map.onCreateLayer');
  }

  onRemoveLayer = (event: OnRemoveLayerEvent): void => {
    this.layerCommunicator.emit('onRemoveLayer', event);
    console.log('TODO fix type in Map.onRemoveLayer');
  }

  setLayersMeta({ layersMeta, enableByDefault }: SetLayersMetaEvent): void {
    const { t } = this.props;
    if (enableByDefault) {
      Object.values(layersMeta).forEach((group) => group.addTo(this.map));
    }
    Object.entries(layersMeta).forEach(([nameKey, group]) => {
      // @ts-ignore
      this.layerControl.addOverlay(group, t(nameKey));
    });
  }
  removeLayersMeta(event: RemoveLayersMetaEvent): void {
    const { layersMeta } = event;
    // const { t } = this.props;
    // if (enableByDefault) {
    Object.values(layersMeta).forEach((group) => group.remove());
    // }
    Object.entries(layersMeta).forEach(([nameKey, group]) => {
      // @ts-ignore
      this.layerControl.removeLayer(group);
    });
  }

  communicatorSubscribe(action: 'on'|'off'): void {
    this.layerCommunicator[action]('openPopup', this.openPopup);
    this.layerCommunicator[action]('closePopup', this.closePopup);
    this.layerCommunicator[action]('setLayersMeta', this.setLayersMeta);
    this.layerCommunicator[action]('removeLayersMeta', this.removeLayersMeta);
    this.layerCommunicator[action]('locateControl', this.onLocateControl);
    // this.layerCommunicator[action]('addToMap', this.addToMap);
  }

  onLocateControl(enable: boolean) {
    if (enable) {
      if (this.locateControl === undefined) {
        // @ts-ignore
        this.locateControl = L.control.locate();
      }
      this.locateControl.addTo(this.map);
    } else {
      if (this.locateControl !== undefined) {
        this.locateControl.remove();
        delete this.locateControl;
      }
    }
  }

  openPopup({ popup }: OpenPopupEvent): void {
    popup.openOn(this.map);
    console.log('TODO fix type in Map.openPopup');
  }

  // addToMap({ control }): void {
  //   control.addTo(this.map);
  //   console.log('TODO fix type in Map.addToMap');
  // }

  closePopup(): void {
    this.map.closePopup();
  }

  render(): JSX.Element {
    // const { map } = this.state;

    const {
      children, commonPropsExtension = {}, translator,
    } = this.props;

    const mapProps = {
      layerCommunicator: this.layerCommunicator,
      translator,
      ...commonPropsExtension,
    };

    return (
      <>
        <div
          className="Map tw-h-full"
          ref={(map2) => (this.mapEl = map2)}
        />
        {this.map && React.Children.map(children, (child) => React.cloneElement(
          // @ts-ignore
          child, {
          ...mapProps,
          }
        ))}
      </>
    );
  }
}
