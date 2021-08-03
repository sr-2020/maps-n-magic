import React, { Component } from 'react';
import './SpiritRouteEditor.css';

import {
  Route,
} from 'react-router-dom';
import { GameModel } from "sr2020-mm-event-engine";

import { SpiritRouteList } from "./SpiritRouteList";
import { SpiritRouteContent } from "./SpiritRouteContent";

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
            <SpiritRouteContent
              id={Number(id)}
              gameModel={gameModel}
              key={Number(id)}
            />
          );
        }}
      />
    </div>
  );
}
