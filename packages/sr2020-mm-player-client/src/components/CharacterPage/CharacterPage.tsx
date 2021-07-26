import React, { useEffect, useState } from 'react';
import './CharacterPage.css';
import moment from 'moment';

import { WithLoginState, WithCharacterDataOnly } from '../../hocs';
import { BodyType, HealthState } from 'sr2020-mm-event-engine';
import { DispiritComponent } from '../DispiritComponent';

interface CharacterPageProps extends WithCharacterDataOnly {
  setTitle: (title: string) => void;
}

const bodyTypeLabel: Record<BodyType, string> = {
  astral: 'Астральное',
  physical: 'Мясное',
  drone: 'Дрон',
  ectoplasm: 'Эктоплазменное',
  vr: 'VR',
}

const healthStateLabel: Record<HealthState, string> = {
  healthy: 'Здоров',
  wounded: 'Тяжело ранен',
  clinically_dead: 'КС',
  biologically_dead: 'АС',
}

export function CharacterPage(props: CharacterPageProps) {
  const { characterData, setTitle } = props;

  useEffect(() => {
    setTitle(`Персонаж`);
  }, []);

  if (characterData === null) {
    return <div>Данные персонажа загружаются</div>
  }

  const isNotNormal = [
    "emergencyDispirited", 
    "suitTimeout"
  ].includes(characterData.spiritSuitState?.suitStatus || '');

  return (
    <div className="CharacterPage tw-p-4">
      {
        characterData.spiritSuitState !== undefined &&
        characterData.spiritSuitState.suitStatus === 'normal' &&
        <div className="tw-m-4 tw-p-4 tw-bg-yellow-300 tw-font-semibold">
          Вы можете быть в теле духа до 
          {
            ' ' + moment(characterData.spiritSuitState.suitStartTime + 
            characterData.spiritSuitState.suitDuration).format('HH:mm')
          } 
        </div>
      }
      {
        characterData.spiritSuitState !== undefined &&
        characterData.spiritSuitState.message !== null &&
        <div className="tw-m-4 tw-p-4 tw-bg-blue-200 tw-font-semibold">
          Вы прочитали мысль духа: {characterData.spiritSuitState.message}
        </div>
      }
      {
        characterData.messageData !== undefined &&
        <div className="tw-m-4 tw-p-4 tw-bg-blue-200 tw-font-semibold">
          {
            moment(characterData.messageData.timestamp).format('HH:mm') + ' ' +
            characterData.messageData.message
          }
        </div>
      }
      {
        characterData.spiritSuitState !== undefined &&
        characterData.spiritSuitState.suitStatus !== 'normal' &&
        <div className="tw-m-4 tw-p-4 tw-bg-red-200 tw-font-semibold">
          Верните свое тело до 
          {
            ' ' + moment(characterData.spiritSuitState.suitStatusChangeTime + 
            10 * 60 * 1000).format('HH:mm')
          }, чтобы не упасть в КС.
        </div>
      }
      <div className="tw-mb-2">
        <span className="tw-w-24 tw-inline-block">Имя</span>
        <span>{characterData.workModel.name}</span>
      </div>
      <div className="tw-mb-2">
        <span className="tw-w-24 tw-inline-block tw-align-top">Тело</span>
        <div className="tw-inline-block">
          <div>{bodyTypeLabel[characterData.workModel.currentBody]}</div>
          {
            characterData.spiritSuitState !== undefined &&
            <div>дух {characterData.spiritSuitState.spiritId} {characterData.spiritSuitState.spiritName}</div>
          }
        </div>
      </div>
      <div className="tw-mb-2">
        <span className="tw-w-24 tw-inline-block">Состояние</span>
        <span>{healthStateLabel[characterData.workModel.healthState]}</span>
      </div>
      {
        isNotNormal &&
        <div>
          <DispiritComponent />
        </div>
      }
    </div>
  );
}
