import React, { Component } from 'react';
import './RescueServiceLayer.css';

import { InnerRescueServiceLayer } from './InnerRescueServiceLayer';

// import { RescueServiceLayerPropTypes } from '../../types';

export class RescueServiceLayer extends Component {
  // static propTypes = RescueServiceLayerPropTypes;

  constructor(props) {
    super(props);
    this.state = {
    };
    this.onСharacterHealthStateChanged = this.onСharacterHealthStateChanged.bind(this);
  }

  componentDidMount() {
    const {
      gameModel, enableByDefault, layerCommunicator,
    } = this.props;
    this.subscribe('on', gameModel);
    this.rescueServiceLayer = new InnerRescueServiceLayer();
    layerCommunicator.emit('setLayersMeta', {
      layersMeta: this.rescueServiceLayer.getLayersMeta(),
      enableByDefault,
    });
    this.populate();
    console.log('RescueServiceLayer mounted');
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
    console.log('RescueServiceLayer did update');
  }

  componentWillUnmount() {
    const {
      gameModel,
    } = this.props;
    this.subscribe('off', gameModel);
    // this.communicatorSubscribe('off');
    this.clear();
    console.log('RescueServiceLayer will unmount');
  }

  populate() {
    const {
      gameModel, t, translator,
    } = this.props;
    this.rescueServiceLayer.populate(gameModel, translator, t);
  }

  clear() {
    this.rescueServiceLayer.clear();
  }

  subscribe(action, gameModel) {
    gameModel[action]('characterHealthStateChanged', this.onСharacterHealthStateChanged);
  }

  onСharacterHealthStateChanged(data) {
    const {
      gameModel,
    } = this.props;
    this.rescueServiceLayer.onСharacterHealthStateChanged(data, gameModel);
  }

  render() {
    return null;
  }
}
