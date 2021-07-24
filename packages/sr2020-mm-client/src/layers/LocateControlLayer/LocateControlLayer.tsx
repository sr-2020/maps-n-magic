import React, { Component } from 'react';
import './LocateControlLayer.css';

import { WithTranslation } from "react-i18next";
import { CommonLayerProps } from 'sr2020-mm-client-core';

interface LocateControlLayerProps extends WithTranslation, CommonLayerProps {
}

export class LocateControlLayer extends Component<
  LocateControlLayerProps
> {

  componentDidMount() {
    const { layerCommunicator } = this.props;
    layerCommunicator.emit('locateControl', true);
  }

  componentWillUnmount() {
    const { layerCommunicator } = this.props;
    layerCommunicator.emit('locateControl', false);
  }

  render () {
    return null;
  }
}
