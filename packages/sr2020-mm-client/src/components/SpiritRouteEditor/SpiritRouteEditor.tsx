import React, { Component } from 'react';
import './SpiritRouteEditor.css';

import {
  Route,
} from 'react-router-dom';
import { GameModel } from "sr2020-mm-event-engine";

import { SpiritRouteList } from "./SpiritRouteList";

interface SpiritRouteEditorProps {
  gameModel: GameModel;
}

export function SpiritRouteEditor(props: SpiritRouteEditorProps) {
  const { gameModel } = props;

  return (
    <div className="SpiritRouteEditor tw-h-full tw-flex">
      <SpiritRouteList gameModel={gameModel} />
      <Route
        path="/spiritRouteEditor/:id"
        render={({ match }) => {
          const { id } = match.params;

          return (
            12131
            // <SpiritContent
            //   id={Number(id)}
            //   gameModel={gameModel}
            //   // spiritTmp={spiritService.getSpirit(Number(id))}
            //   // spiritTmp={spiritService.get({
            //   //   type: 'spirit',
            //   //   id: Number(id),
            //   // })}
            // />
          );
        }}
      />
    </div>
  );
}
