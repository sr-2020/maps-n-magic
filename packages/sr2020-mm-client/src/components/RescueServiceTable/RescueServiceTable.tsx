import React, { useState, useEffect } from 'react';
import './RescueServiceTable.css';
import * as moment from 'moment-timezone';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { CharacterHealthState } from "sr2020-mm-event-engine";

import { WithCharacterHealthListForTable } from '../../dataHOCs';

function formatTime(curTime: number, eventTimestamp: number) {
  let delta = Math.floor((curTime - eventTimestamp) / 1000);
  if (delta < 0) {
    delta = 0;
  }
  const min = Math.floor(delta / 60);
  const sec = delta % 60;
  return (
    <>
      <span className="tw-w-8 tw-pr-2 tw-inline-block tw-text-right">{min}</span>
      мин
      <span className="tw-w-8 tw-px-2 tw-inline-block tw-text-right">{sec}</span>
      c
    </>
  );
}

export function RescueServiceTable(props: WithCharacterHealthListForTable) {
  const { characterHealthList } = props;
  const { t } = useTranslation();

  const [curTime, setCurTime] = useState(moment.utc().valueOf());

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurTime(moment.utc().valueOf());
    }, 500);
    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  return (
    <div className="RescueServiceTable tw-bg-gray-300 tw-p-4">
      {characterHealthList.length === 0 && <span>Список КС пуст</span>}
      {characterHealthList.length !== 0 && (
        <div className="tw-flex tw-mb-4">
          <div className="tw-flex-1 max-w-3xs tw-truncate">Персонаж</div>
          <div className="tw-pl-2">Лайфстайл</div>
          <div className="tw-pl-2 time-min-width">Время в КС</div>
        </div>
      )}
      {
        characterHealthList.map((character: CharacterHealthState, i, arr) => (
          <div
            key={character.characterId}
            className={classNames('tw-flex ', {
              'tw-mb-4': arr.length - 1 !== i,
            })}
          >
            <div className="tw-flex-1 max-w-3xs">
              <div className="tw-truncate" title={`${character.personName} (${character.characterId})`}>{character.personName}</div>
              <div className="tw-text-xs">{character.locationLabel}</div>
            </div>
            <div className="tw-pl-2 " title={t(character.lifeStyle)}>{t(character.lifeStyle)}</div>
            <div className="tw-pl-2  time-min-width">{formatTime(curTime, character.timestamp)}</div>
          </div>
        ))
      }
    </div>
  );
}
