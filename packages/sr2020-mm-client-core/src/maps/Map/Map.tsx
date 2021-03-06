// eslint-disable-next-line max-classes-per-file
import { WithTranslation } from 'react-i18next';
import React, { Component } from 'react';
import { Translator } from "../../utils/Translator";
import * as R from 'ramda';

// import '../../../utils/gpxConverter';

import { L } from "../../misc/leafletWrapper";

import { EventEmitter } from 'events';

// import { Map2PropTypes } from '../../../types';

import { applyLeafletGeomanTranslation, getZoomTranslation } from 'sr2020-mm-translations/leaflet';

// eslint-disable-next-line import/extensions
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.js';
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css';

import './Map.css';

import { LayersMeta } from "../../types";

// console.log(L);
L.Icon.Default.imagePath = './images/leafletImages/';

interface MapProps extends WithTranslation {
  geomanConfig: L.PM.DrawControlOptions;
  defaultCenter: L.LatLngTuple;
  defaultZoom: number;
  translator: Translator;
  commonPropsExtension: object;
}
interface MapState {
  map: L.Map;
}

export class Map extends Component<MapProps, MapState> {
  // static propTypes = Map2PropTypes;
  layerCommunicator: EventEmitter;

  map: L.Map;

  layerControl: L.Control.Layers;

  mapEl: HTMLElement;

  constructor(props: MapProps) {
    super(props);
    this.state = {
      map: null,
    };
    this.openPopup = this.openPopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.setLayersMeta = this.setLayersMeta.bind(this);
    this.removeLayersMeta = this.removeLayersMeta.bind(this);
    this.addToMap = this.addToMap.bind(this);
  }

  // eslint-disable-next-line max-lines-per-function
  componentDidMount(): void {
    const {
      geomanConfig, defaultCenter, defaultZoom,
    } = this.props;

    this.layerCommunicator = new EventEmitter();

    this.map = L.map(this.mapEl, {
      center: defaultCenter,
      zoom: defaultZoom,
      zoomControl: false,
    });

    L.control.zoom({
      ...getZoomTranslation(),
      position: 'topleft',
    }).addTo(this.map);

    this.layerControl = L.control.layers();
    this.layerControl.addTo(this.map);

    if (geomanConfig) {
      this.map.pm.addControls(geomanConfig);
      applyLeafletGeomanTranslation(this.map);
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
      translator, defaultCenter,
    } = this.props;
    if (prevProps.translator !== translator) {
      this.map.panTo(translator.getVirtualCenter() || defaultCenter);
      console.log('position changed');
    }
    // console.log('Map did update');
  }

  componentWillUnmount(): void {
    this.communicatorSubscribe('off');
  }

  onCreateLayer = (event): void => {
    this.layerCommunicator.emit('onCreateLayer', event);
    console.log('TODO fix type in Map.onCreateLayer');
  }

  onRemoveLayer = (event): void => {
    this.layerCommunicator.emit('onRemoveLayer', event);
    console.log('TODO fix type in Map.onRemoveLayer');
  }

  setLayersMeta({ layersMeta, enableByDefault }:{
    layersMeta: LayersMeta,
    enableByDefault: boolean
  }): void {
    const { t } = this.props;
    if (enableByDefault) {
      Object.values(layersMeta).forEach((group) => group.addTo(this.map));
    }
    Object.entries(layersMeta).forEach(([nameKey, group]) => {
      // @ts-ignore
      this.layerControl.addOverlay(group, t(nameKey));
    });
  }

  removeLayersMeta({ layersMeta }: {layersMeta: LayersMeta}): void {
    // const { t } = this.props;
    // if (enableByDefault) {
    Object.values(layersMeta).forEach((group) => group.remove());
    // }
    Object.entries(layersMeta).forEach(([nameKey, group]) => {
      this.layerControl.removeLayer(group);
    });
  }

  communicatorSubscribe(action: 'on'|'off'): void {
    this.layerCommunicator[action]('openPopup', this.openPopup);
    this.layerCommunicator[action]('closePopup', this.closePopup);
    this.layerCommunicator[action]('setLayersMeta', this.setLayersMeta);
    this.layerCommunicator[action]('removeLayersMeta', this.removeLayersMeta);
    this.layerCommunicator[action]('addToMap', this.addToMap);
  }

  openPopup({ popup }): void {
    popup.openOn(this.map);
    console.log('TODO fix type in Map.openPopup');
  }

  addToMap({ control }): void {
    control.addTo(this.map);
    console.log('TODO fix type in Map.addToMap');
  }

  closePopup(): void {
    this.map.closePopup();
  }

  render(): JSX.Element {
    const { map } = this.state;

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
        {map && React.Children.map(children, (child) => React.cloneElement(
          // @ts-ignore
          child, {
          ...mapProps,
          }
        ))}
      </>
    );
  }
}
