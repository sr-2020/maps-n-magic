import React, { Component } from 'react';
import './SpiritConsistency.css';

import { WithTranslation } from "react-i18next";
import { ErrorResponse, GameModel, Spirit, SpiritConsistencyResponse } from 'sr2020-mm-event-engine';
import * as R from 'ramda';

import Button from 'react-bootstrap/Button';
import { SpiritToQrConsistency } from "./SpiritToQrConsistency";
import { QrStatus } from './QrStatus';

interface SpiritConsistencyProps extends WithTranslation {
  gameModel: GameModel;
}

interface SpiritConsistencyState {
  spiritConsistencyReport: {
    spirit: Spirit;
    errorResponse: SpiritConsistencyResponse;
  }[] | null;
}

export class SpiritConsistency extends Component<
  SpiritConsistencyProps,
  SpiritConsistencyState
> {
  constructor(props: SpiritConsistencyProps) {
    super(props);
    this.state = {
      spiritConsistencyReport: null
    };
  }

  render () {
    const { spiritConsistencyReport } = this.state;

    return (
      <div className="SpiritConsistency tw-px-8 tw-py-4 tw-h-full tw-overflow-auto">
        <div className="tw-flex">
          <SpiritToQrConsistency 
            className="tw-mr-16"
            gameModel={this.props.gameModel}
          />
          <QrStatus 
            gameModel={this.props.gameModel}
          />
        </div>
      </div>
    );
  }
}
