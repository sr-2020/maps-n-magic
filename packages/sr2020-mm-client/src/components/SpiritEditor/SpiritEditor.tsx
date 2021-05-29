import React, { Component } from 'react';
import './SpiritEditor.css';

import {
  Route,
} from 'react-router-dom';
import { GameModel } from "sr2020-mm-event-engine";

import { SpiritList } from './SpiritList';
import { SpiritContent } from './SpiritContent';
// import { FractionList } from './FractionList';

interface SpiritEditorProps {
  gameModel: GameModel;
}

export function SpiritEditor(props: SpiritEditorProps) {
  const { gameModel } = props;

  return (
    <div className="SpiritEditor tw-h-full tw-flex">
      <SpiritList gameModel={gameModel} />
      <Route
        path="/spiritEditor/:id"
        render={({ match }) => {
          const { id } = match.params;

          return (
            <SpiritContent
              id={Number(id)}
              gameModel={gameModel}
              // spiritTmp={spiritService.getSpirit(Number(id))}
              // spiritTmp={spiritService.get({
              //   type: 'spirit',
              //   id: Number(id),
              // })}
            />
          );
        }}
      />
      {/* <FractionList spiritService={spiritService} /> */}
    </div>
  );
}
