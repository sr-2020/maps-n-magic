import React, { Component, FormEvent } from 'react';
import './QrStatus.css';

import { WithTranslation } from "react-i18next";
import { GameModel } from 'sr2020-mm-event-engine';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

interface QrStatusProps extends WithTranslation {
  gameModel: GameModel;
}
interface QrStatusState {
  qrId: number | null;
  report: any;
}

export class QrStatus extends Component<
  QrStatusProps,
  QrStatusState
>{
  constructor(props: QrStatusProps) {
    super(props);
    this.state = {
      qrId: null,
      report: null
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.forceFreeSpirit = this.forceFreeSpirit.bind(this);
  }

  onSubmit(e: FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    e.stopPropagation();
    e.preventDefault();
    const qrId2 = Number(form.qrId.value.trim());
    if (Number.isNaN(qrId2)) {
      return;
    }

    this.setState({
      report: null,
      qrId: qrId2
    });

    this.getQrData(qrId2);
  }
  
  async getQrData(qrId2: number) {
    const res = await fetch('/api/checkQrById/' + qrId2);
    const json = await res.json();
    // console.log(json);
    this.setState({
      report: json
    });
  }

  async forceFreeSpirit() {
    const { qrId } = this.state;
    if (qrId === null) {
      return;
    }
    const res = await fetch('/api/forceFreeSpirit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({qrId})
    });
    this.getQrData(qrId);
  }

  render() {
    const { t } = this.props;
    const { report } = this.state;

    return (
      <div className="QrStatus">
        <Form
          className="tw-mx-auto tw-mb-8"
          // style={{ width: '20rem' }}
          onSubmit={this.onSubmit}
        >
          <Form.Group controlId="qrId">
            <Form.Label>{t('enterQrId')}</Form.Label>
            <Form.Control />
          </Form.Group>
          <div className="tw-text-right">
            <Button variant="primary" type="submit">
              {t('check')}
            </Button>
          </div>
        </Form>
        <div className="tw-mb-8">
          {JSON.stringify(report)}
        </div>
        {
          report?.qrType === "spiritJar" &&
          <div className="tw-mb-8" onClick={this.forceFreeSpirit}>
            <Button variant="primary" >
              {t('freeJarFromQr')}
            </Button>
          </div>
        }
      </div>
    );
  }
}
