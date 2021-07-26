import React, { Component } from 'react';
import './SpiritToQrConsistency.css';

import { WithTranslation } from "react-i18next";
import { ErrorResponse, GameModel, Spirit, SpiritConsistencyResponse } from 'sr2020-mm-event-engine';
import * as R from 'ramda';

import Button from 'react-bootstrap/Button';
import classNames from 'classnames';

interface SpiritToQrConsistencyProps extends WithTranslation {
  gameModel: GameModel;
  className?: string;
}

interface SpiritToQrConsistencyState {
  spiritConsistencyReport: {
    spirit: Spirit;
    errorResponse: SpiritConsistencyResponse;
  }[] | null;
  batchSpiritJarsReport: any[] | null;
  batchBodyStorageReport: any[] | null;
}

export class SpiritToQrConsistency extends Component<
  SpiritToQrConsistencyProps,
  SpiritToQrConsistencyState
> {
  constructor(props: SpiritToQrConsistencyProps) {
    super(props);
    this.state = {
      spiritConsistencyReport: null,
      batchSpiritJarsReport: null,
      batchBodyStorageReport: null,
    };
    this.getSpiritConsistencyReport = this.getSpiritConsistencyReport.bind(this);
    this.moveSpiritsToAstral = this.moveSpiritsToAstral.bind(this);
    this.getBatchSpiritJarsReport = this.getBatchSpiritJarsReport.bind(this);
    this.getBatchBodyStorageReport = this.getBatchBodyStorageReport.bind(this);
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
    this.setState({
      spiritConsistencyReport: null
    });

    const res = await fetch('/api/spiritConsistencyReport', {
      method: 'GET',
    });
    const json = await res.json();
    // console.log(json);
    this.setState({
      spiritConsistencyReport: json
    });
  }

  async getBatchSpiritJarsReport() {
    this.setState({
      batchSpiritJarsReport: null
    });
    const res = await fetch('/api/checkSpiritJarsBatch', {
      method: 'GET',
    });
    const json = await res.json();
    // console.log(json);
    this.setState({
      batchSpiritJarsReport: json
    });
  }

  async getBatchBodyStorageReport() {
    this.setState({
      batchBodyStorageReport: null
    });
    const res = await fetch('/api/checkBodyStorageBatch', {
      method: 'GET',
    });
    const json = await res.json();
    // console.log(json);
    this.setState({
      batchBodyStorageReport: json
    });
  }

  render () {
    const { 
      spiritConsistencyReport, 
      batchSpiritJarsReport,
      batchBodyStorageReport
    } = this.state;

    return (
      <div className={classNames('SpiritToQrConsistency', this.props.className)}>
        <div className="tw-mb-8">
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

        <div>
          <div className="tw-mb-8">
            <Button variant="primary" onClick={this.getBatchSpiritJarsReport}>
              Массовая проверка тотемов
            </Button>
          </div>
          <div className="tw-mb-8">
            {
              batchSpiritJarsReport !== null && 
              batchSpiritJarsReport.map(item => 
                <div>{JSON.stringify(item)}</div>
              )
            }
          </div>
        </div>
        
        <div>
          <div className="tw-mb-8">
            <Button variant="primary" onClick={this.getBatchBodyStorageReport}>
              Массовая проверка телохранилищ
            </Button>
          </div>
          <div className="tw-mb-8">
            {
              batchBodyStorageReport !== null && 
              batchBodyStorageReport.map(item => 
                <div>{JSON.stringify(item)}</div>
              )
            }
          </div>
        </div>
      </div>
    );
  }
}
