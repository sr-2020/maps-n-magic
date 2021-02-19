import React, { Component } from 'react';
import './VoronoiPolygonsLayer2.css';

import { L } from "sr2020-mm-client-core/leafletWrapper";
import * as R from 'ramda';

import { COLOR_PALETTE } from 'sr2020-mm-client-core/utils/colorPalette';

// import { VoronoiPolygonsLayer2PropTypes } from '../../types';

export class VoronoiPolygonsLayer2 extends Component {
  // static propTypes = VoronoiPolygonsLayer2PropTypes;
  polygonsGroup = L.layerGroup([]);

  massCentersGroup = L.layerGroup([]);

  polygonsKey = 'voronoiPolygonsLayer';

  massCentersGroupKey = 'massCentersLayer';

  constructor(props) {
    super(props);
    this.state = {
    };
    this.updateVoronoiPolygons = this.updateVoronoiPolygons.bind(this);
  }

  componentDidMount() {
    const {
      gameModel, enableByDefault, layerCommunicator,
    } = this.props;
    this.subscribe('on', gameModel);
    layerCommunicator.emit('setLayersMeta', {
      layersMeta: this.getLayersMeta(),
      enableByDefault,
    });
    this.populate();
    console.log('VoronoiPolygonsLayer2 mounted');
  }

  componentDidUpdate(prevProps) {
    const { gameModel, translator } = this.props;
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
    console.log('VoronoiPolygonsLayer2 did update');
  }

  componentWillUnmount() {
    this.clear();
    const {
      gameModel,
    } = this.props;
    this.subscribe('off', gameModel);
    console.log('VoronoiPolygonsLayer2 will unmount');
  }

  getLayersMeta() {
    return {
      [this.polygonsKey]: this.polygonsGroup,
      [this.massCentersGroupKey]: this.massCentersGroup,
    };
  }

  subscribe(action, gameModel) {
    gameModel[action]('putBeacon', this.updateVoronoiPolygons);
    gameModel[action]('postBeacon', this.updateVoronoiPolygons);
    gameModel[action]('deleteBeacon', this.updateVoronoiPolygons);
  }

  clear() {
    this.massCentersGroup.clearLayers();
    this.polygonsGroup.clearLayers();
  }

  populate() {
    const {
      gameModel, translator,
    } = this.props;
    const { boundingPolylineData, polygonData } = gameModel.get('voronoiPolygonData');
    const boundingPolyline = L.polyline(translator.moveTo(boundingPolylineData), { color: 'blue' });
    const polygons = polygonData.clippedPolygons.map((polygon, i) => L.polygon(translator.moveTo(polygon), {
      fillColor: COLOR_PALETTE[i % COLOR_PALETTE.length].color.background,
      fillOpacity: 0.5,
      pmIgnore: true,
    }));

    polygons.forEach((p) => this.polygonsGroup.addLayer(p));
    this.polygonsGroup.addLayer(boundingPolyline);

    const massCenters = polygonData.clippedCenters
      .filter((massCenter) => !Number.isNaN(massCenter.x) && !Number.isNaN(massCenter.y))
      .map((massCenter) => L.circleMarker(translator.moveTo([massCenter.x, massCenter.y]), {
        radius: 5,
        pmIgnore: true,
      }));
    massCenters.forEach((p) => this.massCentersGroup.addLayer(p));
  }

  updateVoronoiPolygons() {
    this.clear();
    this.populate();
  }

  render() {
    return null;
  }
}
