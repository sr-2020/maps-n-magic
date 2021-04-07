import React, { Component } from 'react';
import './SpiritEditor.css';

import {
  Route,
} from 'react-router-dom';
import { GameModel } from "sr2020-mm-event-engine";

import { SpiritList } from './SpiritList';
import { SpiritContent } from './SpiritContent';
import { FractionList } from './FractionList';

interface SpiritEditorProps {
  spiritService: GameModel;
}

// eslint-disable-next-line react/prefer-stateless-function
export class SpiritEditor extends Component<SpiritEditorProps> {

  // eslint-disable-next-line max-lines-per-function
  render() {
    const { spiritService } = this.props;

    return (
      <div className="SpiritEditor tw-h-full tw-flex">
        <SpiritList spiritService={spiritService} />
        <Route
          path="/spiritEditor/:id"
          render={({ match }) => {
            const { id } = match.params;

            return (
              <SpiritContent
                id={Number(id)}
                spiritService={spiritService}
                // spiritTmp={spiritService.getSpirit(Number(id))}
                // spiritTmp={spiritService.get({
                //   type: 'spirit',
                //   id: Number(id),
                // })}
              />
            );
          }}
        />
        <FractionList spiritService={spiritService} />
      </div>
    );
  }
}
