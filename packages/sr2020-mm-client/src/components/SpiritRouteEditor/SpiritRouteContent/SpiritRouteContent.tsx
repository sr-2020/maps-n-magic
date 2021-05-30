import React, { Component, ChangeEvent } from 'react';
import './SpiritRouteContent.css';

import Form from 'react-bootstrap/Form';
import { EPutSpiritRouteRequested, GameModel, GetSpiritRoute } from "sr2020-mm-event-engine";
import DocumentTitle from 'react-document-title';

import { WithTranslation } from "react-i18next";

interface SpiritRouteContentProps extends WithTranslation {
  id: number;
  gameModel: GameModel;
}
type SpiritRouteContentState = {
  initialized: false;
} | {
  initialized: true;
  name: string;
  waitTimeMinutes: number;
};

type spiritRouteFields = 'name' | 'waitTimeMinutes';

export class SpiritRouteContent extends Component<
  SpiritRouteContentProps, 
  SpiritRouteContentState
> {

  constructor(props: SpiritRouteContentProps) {
    super(props);
    const {gameModel, id} = props;
    
    const spiritRoute = gameModel.get2<GetSpiritRoute>({
      type: 'spiritRoute',
      id,
    });
    
    if (spiritRoute) {
      this.state = {
        initialized: true,
        name: spiritRoute.name,
        waitTimeMinutes: spiritRoute.waitTimeMinutes,
      };
    } else {
      this.state = {
        initialized: false,
      };
    }

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { target } = event;
    const name = target.name as spiritRouteFields;
    const value = this.getTargetValue(name, target);
    const { id, gameModel } = this.props;

    gameModel.emit2<EPutSpiritRouteRequested>({
      type: 'putSpiritRouteRequested',
      id,
      props: {
        [name]: value,
      }
    });

    this.setState(prevState => ({...prevState, [name]: value}));
  }

  getTargetValue(name: spiritRouteFields, target: HTMLInputElement) {
    switch (target.type) {
    // case 'checkbox':
    //   return target.checked;
    case 'number':
      return Number(target.value);
    default:
      // if(name === 'fraction') {
      //   return Number(target.value);
      // }
      return target.value;
    }
  }

  render() {
    const state = this.state;
    if (!state.initialized) {
      return null;
    }
    const {
      name, waitTimeMinutes
    } = state;
    const { gameModel, id, t } = this.props;
    return (
      <DocumentTitle title={name}>
        <div className="SpiritRouteContent tw-flex-grow tw-px-16 tw-py-8 tw-overflow-auto">
          <div>
            <h2 className="tw-mb-8 tw-w-2/4">
              <Form.Control
                name="name"
                type="text"
                className="tw-text-3xl"
                value={name}
                onChange={this.handleInputChange}
              />
            </h2>

            <div className="tw-table">
              <div className="tw-table-row">
                <label
                  htmlFor="waitTimeMinutesInput" 
                  className="tw-table-cell tw-pr-4"
                >
                  {t('waitTimeMinutes')}
                </label>
                <div className="tw-table-cell">
                  <Form.Control
                    name="waitTimeMinutes"
                    type="number"
                    className="tw-w-16"
                    id="waitTimeMinutesInput"
                    value={waitTimeMinutes}
                    onChange={this.handleInputChange}
                    min={1}
                    max={60}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}

