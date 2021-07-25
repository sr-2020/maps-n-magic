import React, { Component } from 'react';
import './SpiritConsistency.css';

import { WithTranslation } from "react-i18next";
import { ErrorResponse, GameModel, Spirit } from 'sr2020-mm-event-engine';

import Button from 'react-bootstrap/Button';

interface SpiritConsistencyProps extends WithTranslation {
  gameModel: GameModel;
}

interface SpiritConsistencyState {
  spiritConsistencyReport: {
    spirit: Spirit;
    errorResponse: ErrorResponse;
  }[];
}

export class SpiritConsistency extends Component<
  SpiritConsistencyProps,
  SpiritConsistencyState
> {
  constructor(props: SpiritConsistencyProps) {
    super(props);
    this.state = {
      spiritConsistencyReport: []
    };
    // this.createSpiritRoute = this.createSpiritRoute.bind(this);
    // this.cloneSpiritRoute = this.cloneSpiritRoute.bind(this);
    this.getSpiritConsistencyReport = this.getSpiritConsistencyReport.bind(this);
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
      <div className="SpiritConsistency">
        <Button variant="primary" onClick={this.getSpiritConsistencyReport}>
          Сформировать отчет о согласованности духов
        </Button>
        {
          spiritConsistencyReport.map( item => 
            <div>
              <div>{item.spirit.id} {item.spirit.name}</div>
              <div>{JSON.stringify(item.errorResponse)}</div>
            </div>  
          )
        }
        {/* {JSON.stringify(spiritConsistencyReport)} */}
      </div>
    );
  }
}
