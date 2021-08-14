import * as R from 'ramda';
import React from 'react';
import moment from 'moment';
import './PlayerMessages.css';

import { WithTranslation } from "react-i18next";
import { GameModel } from 'sr2020-mm-event-engine';

import { WithPlayerMessages } from '../../dataHOCs';
import { SRTKey } from 'sr2020-mm-client-core';

interface PlayerMessagesProps extends WithTranslation, WithPlayerMessages {
  gameModel: GameModel;
}

const fractionNameObj: Record<number, SRTKey> = {
  1: "noFraction",
  2: "barguzin",
  3: "kultuk",
  4: "sarma",
};

export function getFractionName(id: number): SRTKey {
  return fractionNameObj[id] || 'unknownFraction';
}

export function PlayerMessages(props: PlayerMessagesProps) {
  const { playerMessages, t } = props;

  if (playerMessages === null) {
    return (
      <div>{t('playerMessagesLoading')}</div>
    );
  }


  return (
    <div className="PlayerMessages tw-h-full tw-flex tw-overflow-auto tw-p-8 ">
      <div>
        {
          playerMessages.map(playerMessage => (
            <div key={playerMessage.id} className="tw-mb-8">
              <div className="tw-mb-4">
                <span className="tw-inline-block tw-mr-16" style={{width: '25rem'}}>
                  {t('playerMessageLabel', {
                    characterId: playerMessage.characterId,
                    spiritId: playerMessage.spiritId,
                    spiritFractionId: playerMessage.spiritFractionId,
                    fractionName: t(getFractionName(playerMessage.spiritFractionId)),
                  })}
                </span>
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



