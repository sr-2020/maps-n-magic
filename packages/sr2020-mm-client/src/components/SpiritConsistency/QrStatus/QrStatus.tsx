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
  report: any;
}

export class QrStatus extends Component<
  QrStatusProps,
  QrStatusState
>{
  constructor(props: QrStatusProps) {
    super(props);
    this.state = {
      report: null
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  async onSubmit(e: FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    e.stopPropagation();
    e.preventDefault();
    const qrId2 = Number(form.qrId.value.trim());
    if (Number.isNaN(qrId2)) {
      return;
    }

    this.setState({
      report: null
    });

    const res = await fetch('/api/checkQrById/' + qrId2);
    const json = await res.json();
    // console.log(json);
    this.setState({
      report: json
    });
  }

  render() {
    // const { t } = props;
    const { report } = this.state;

    return (
      <div className="QrStatus">
        {/* <div> */}
        <Form
          className="tw-mx-auto tw-mb-8"
          // style={{ width: '20rem' }}
          onSubmit={this.onSubmit}
        >
          <Form.Group controlId="qrId">
            <Form.Label>Введите Id куара</Form.Label>
            <Form.Control />
          </Form.Group>
          <div className="tw-text-right">
            <Button variant="primary" type="submit">
              Проверить
            </Button>
          </div>
        </Form>
        <div>
          {JSON.stringify(report)}
        </div>
      </div>
    );
  }
}
