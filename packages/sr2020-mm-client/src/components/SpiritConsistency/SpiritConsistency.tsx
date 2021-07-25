import React, { Component } from 'react';
import './SpiritConsistency.css';

import { WithTranslation } from "react-i18next";
import { ErrorResponse, GameModel, Spirit, SpiritConsistencyResponse } from 'sr2020-mm-event-engine';
import * as R from 'ramda';

import Button from 'react-bootstrap/Button';

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
    // this.createSpiritRoute = this.createSpiritRoute.bind(this);
    // this.cloneSpiritRoute = this.cloneSpiritRoute.bind(this);
    this.getSpiritConsistencyReport = this.getSpiritConsistencyReport.bind(this);
    this.moveSpiritsToAstral = this.moveSpiritsToAstral.bind(this);
  }

  async moveSpiritsToAstral() {
    const { spiritConsistencyReport } = this.state;

    if (spiritConsistencyReport === null) {
      return;
    }
    
    const spiritIds = spiritConsistencyReport.map(el => el.spirit.id);
    this.setState({
      spiritConsistencyReport: null
    });
    const res = await fetch('/api/moveSpiritsToAstral', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(spiritIds)
    });
    this.getSpiritConsistencyReport();
  }


  async getSpiritConsistencyReport() {
    const res = await fetch('/api/spiritConsistencyReport', {
      method: 'GET',
    });
    const json = await res.json();
    // console.log(json);
    this.setState({
      spiritConsistencyReport: json
    });
  }

  render () {
    const { spiritConsistencyReport } = this.state;

    return (
      <div className="SpiritConsistency tw-px-8 tw-py-4 tw-h-full tw-overflow-auto">
        <div className="tw-mb-8">
          <Button variant="primary" onClick={this.getSpiritConsistencyReport}>
            Сформировать отчет о согласованности духов в океане
          </Button>
        </div>
        <div className="tw-mb-8">
          {
            spiritConsistencyReport !== null && 
            spiritConsistencyReport.length == 0 &&
            <div>Данные корректны</div>
          }
          {
            spiritConsistencyReport !== null &&
            spiritConsistencyReport.map( item => 
              <div>
                <div>{item.spirit.id} {item.spirit.name}</div>
                <div>{JSON.stringify(item.errorResponse)}</div>
              </div>  
            )
          }
        </div>
        <div>
          <Button 
            variant="primary" 
            disabled={spiritConsistencyReport === null || spiritConsistencyReport.length == 0} 
            onClick={this.moveSpiritsToAstral}
          >
            Перевести всех несогласованных духов в астрал
          </Button>
        </div>
      </div>
    );
  }
}
