import * as R from 'ramda';
import React from 'react';
import moment from 'moment';
import './PlayerMessages.css';

import { WithTranslation } from "react-i18next";
import { GameModel } from 'sr2020-mm-event-engine';

import { WithPlayerMessages } from '../../dataHOCs';

interface PlayerMessagesProps extends WithTranslation, WithPlayerMessages {
  gameModel: GameModel;
}

const fractionNameObj: Record<number, string> = {
  1: "Без фракции",
  2: "Баргузин",
  3: "Култук",
  4: "Сарма",
};

export function getFractionName(id: number): string {
  return fractionNameObj[id] || '';
}

export function PlayerMessages(props: PlayerMessagesProps) {
  const { playerMessages } = props;

  if (playerMessages === null) {
    return (
      <div>Сообщения игроков загружаются...</div>
    );
  }


  return (
    <div className="PlayerMessages tw-h-full tw-flex tw-overflow-auto tw-p-8 ">
      <div>
        {
          playerMessages.map(playerMessage => (
            <div key={playerMessage.id} className="tw-mb-8">
              <div className="tw-mb-4">
                <span className="tw-inline-block tw-mr-16" style={{width: '25rem'}}>{`Игрок ${playerMessage.characterId} отпустил духа ${playerMessage.spiritId} из фракции ${playerMessage.spiritFractionId} ${getFractionName(playerMessage.spiritFractionId)}`}</span>
                <span>{moment(new Date(playerMessage.id)).format('D MMM YYYY HH:mm:ss')}</span>
              </div>
              <div className="tw-ml-8">
                {playerMessage.messageBody}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}



