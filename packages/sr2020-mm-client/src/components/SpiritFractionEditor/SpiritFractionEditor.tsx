import React from 'react';
import './SpiritFractionEditor.css';

import { WithTranslation } from "react-i18next";
import { GameModel } from 'sr2020-mm-event-engine';
import { SpiritFractionList } from './SpiritFractionList';
import { Route } from 'react-router-dom';
import { SpiritFractionContent } from './SpiritFractionContent';

interface SpiritFractionEditorProps extends WithTranslation {
  gameModel: GameModel;
}

export function SpiritFractionEditor(props: SpiritFractionEditorProps) {
  const { gameModel } = props;

  return (
    <div className="SpiritFractionEditor tw-h-full tw-flex">
      <SpiritFractionList gameModel={gameModel} />
      <Route
        path="/spiritFractionEditor/:id"
        render={({ match }) => {
          const { id } = match.params;

          return (
            <SpiritFractionContent
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



