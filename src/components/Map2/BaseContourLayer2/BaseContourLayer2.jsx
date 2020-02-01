import React, { Component } from 'react';
import './BaseContourLayer2.css';

import L from 'leaflet/dist/leaflet-src';
import * as R from 'ramda';

import { baseClosedLLs, baseLLs } from '../../../data/baseContours';

// import { BaseContourLayer2PropTypes } from '../../types';

export class BaseContourLayer2 extends Component {
  // static propTypes = BaseContourLayer2PropTypes;
  group = L.layerGroup([]);

  nameKey = 'baseContourLayer';

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const {
      enableByDefault, setLayersMeta,
    } = this.props;
    // this.subscribe('on', gameModel);
    setLayersMeta(this.getLayersMeta(), enableByDefault);
    this.populate();
    console.log('BaseContourLayer2 mounted');
  }

  componentDidUpdate() {
    // const { gameModel } = this.props;
    // if (prevProps.gameModel !== gameModel) {
    //   this.subscribe('off', prevProps.gameModel);
    //   this.subscribe('on', gameModel);
    //   this.clear();
    //   this.populate();
    // }
    console.log('BaseContourLayer2 did update');
  }

  componentWillUnmount() {
    this.clear();
    console.log('BaseContourLayer2 will unmount');
  }

  getLayersMeta() {
    return {
      [this.nameKey]: this.group,
    };
  }

  populate() {
    const { translator } = this.props;
    const baseLine = L.polyline(translator.moveTo(baseLLs), {
      color: 'green',
      pmIgnore: true,
    });
    const baseClosedLine = L.polyline(translator.moveTo(baseClosedLLs), {
      color: 'darkviolet',
      pmIgnore: true,
    });
    this.group.addLayer(baseLine);
    this.group.addLayer(baseClosedLine);
  }

  clear() {
    this.group.clearLayers();
  }

  render() {
    return null;
  }
}
