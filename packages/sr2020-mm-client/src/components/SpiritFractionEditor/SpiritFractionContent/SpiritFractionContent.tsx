import React, { Component, ChangeEvent, useState } from 'react';
import './SpiritFractionContent.css';
import * as R from 'ramda';

import { WithTranslation } from "react-i18next";
import { EPutSpiritFractionRequested, GameModel, GetSpiritFraction, SpiritFraction } from 'sr2020-mm-event-engine';
import DocumentTitle from 'react-document-title';
import Form from 'react-bootstrap/Form';
import { AbilitiesInput2 } from '../../SpiritEditor/SpiritContent/AbilitiesInput2';

interface SpiritFractionContentProps extends WithTranslation {
  id: number;
  gameModel: GameModel;
}
type SpiritFractionContentState = {
  initialized: false;
} | {
  initialized: true;
  name: SpiritFraction["name"];
  abilities: SpiritFraction["abilities"];
};

type spiritFields = 
  | 'name' 
  | 'abilities'
;

export class SpiritFractionContent extends Component<
  SpiritFractionContentProps, 
  SpiritFractionContentState
> {
  updateSpiritFractionTimeoutId: NodeJS.Timeout | undefined;

  constructor(props: SpiritFractionContentProps) {
    super(props);
    const { gameModel, id } = props;
    
    const spiritFraction = gameModel.get2<GetSpiritFraction>({
      type: 'spiritFraction',
      id,
    });
    
    if (spiritFraction) {
      this.state = {
        initialized: true,
        name: spiritFraction.name,
        abilities: spiritFraction.abilities,
      };
    } else {
      this.state = {
        initialized: false,
      };
    }
    this.changeSpiritFractionAbilities = this.changeSpiritFractionAbilities.bind(this);
    this.updateSpiritFraction = this.updateSpiritFraction.bind(this);
  }

  changeSpiritFractionAbilities (abilities: string[]): void {
    this.setState((prevState) => {
      if (!prevState.initialized) {
        return;
      }
      
      return { ...prevState, abilities };
    }, this.updateSpiritFraction);
  }

  updateSpiritFraction(): void {
    const { id, gameModel } = this.props;
    const { state } = this;
    
    if (!state.initialized) {
      return;
    }
    if (this.updateSpiritFractionTimeoutId !== undefined) {
      clearTimeout(this.updateSpiritFractionTimeoutId);
    }

    this.updateSpiritFractionTimeoutId = setTimeout(() => {
      gameModel.emit2<EPutSpiritFractionRequested>({
        type: 'putSpiritFractionRequested',
        id,
        props: {
          name: state.name,
          abilities: state.abilities,
        }
      });
    }, 500);
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const componentState = this.state;
    if (!componentState.initialized) {
      return null;
    }
    const {
      name, 
      initialized, 
      abilities,
    } = componentState;
    const { gameModel, id, t } = this.props;

    if (!id) {
      return (
        <div className="SpiritFractionContent tw-flex-grow">
          {t('youHaveNoSpirits')}
        </div>
      );
    }

    return (
      <DocumentTitle title={'Фракция духов ' + name}>

        <div className="SpiritFractionContent tw-flex-grow tw-px-16 tw-py-8 tw-overflow-auto">
          <div>
            <h2 className="tw-mb-8 tw-w-2/4">
              <Form.Control
                name="name"
                type="text"
                className="tw-text-3xl"
                value={name}
                readOnly
              />
            </h2>

            <div className="tw-table">
              <div className="tw-table-row">
                <label htmlFor="abilitiesInput" className="tw-table-cell">Абилки</label>
                <div className="tw-table-cell">
                  <AbilitiesInput2
                    id="abilitiesInput"
                    gameModel={gameModel}
                    abilities={abilities}
                    onChange={this.changeSpiritFractionAbilities}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}


