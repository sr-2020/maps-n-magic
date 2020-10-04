import React, { useState, useEffect } from 'react';
import './RescueServiceTable.css';
import * as moment from 'moment-timezone';

function formatTime(curTime, eventTimestamp) {
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

export function RescueServiceTable(props) {
  const { characterHealthList } = props;

  const [curTime, setCurTime] = useState(moment().utc().valueOf());

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurTime(moment().utc().valueOf());
    }, 500);
    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  return (
    <div className="RescueServiceTable tw-bg-gray-300 tw-p-4">
      {characterHealthList.length === 0 && <span>Список КС пуст</span>}
      {characterHealthList.length !== 0 && (
        <div className="tw-mb-4">
          <span>Персонаж</span>
          <span className="tw-pl-4 tw-float-right time-min-width">Время в КС</span>
          <span className="tw-pl-4 tw-float-right">ЛС</span>
        </div>
      )}
      {
        characterHealthList.map((character) => (
          <div key={character.characterId}>
            {/* <span>{character.userName}</span> */}
            <span>{character.personName}</span>
            <span className="tw-pl-4 tw-float-right time-min-width">{formatTime(curTime, character.timestamp)}</span>
            <span className="tw-pl-4 tw-float-right">{character.lifeStyle}</span>
          </div>
        ))
      }
    </div>
  );
}
