import React, { Component } from 'react';
import './ManaOceanLayer.css';

import { InnerManaOceanLayer } from './InnerManaOceanLayer';

export class ManaOceanLayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const {
      gameModel, enableByDefault, layerCommunicator,
    } = this.props;
    this.subscribe('on', gameModel);
    this.manaOceanLayer = new InnerManaOceanLayer();
    layerCommunicator.emit('setLayersMeta', {
      layersMeta: this.manaOceanLayer.getLayersMeta(),
      enableByDefault,
    });
    this.populate();
    console.log('ManaOceanLayer mounted');
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
    console.log('ManaOceanLayer did update');
  }

  componentWillUnmount() {
    const {
      gameModel,
    } = this.props;
    this.subscribe('off', gameModel);
    // this.communicatorSubscribe('off');
    this.clear();
    console.log('ManaOceanLayer will unmount');
  }

  populate() {
    const {
      gameModel, t, translator,
    } = this.props;
    // this.locationsLayer.populate(gameModel, translator, t, this.setMarkerEventHandlers);
    this.manaOceanLayer.populate(gameModel, translator, t);
  }

  clear() {
    this.manaOceanLayer.clear();
  }

  subscribe(action, gameModel) {
    // gameModel[action]('postLocationRecord', this.onPostLocationRecord);
    // gameModel[action]('putLocationRecord', this.onPutLocationRecord);
  }

  render() {
    return null;
  }
}
