import React, { useEffect, useState } from 'react';
import './CharacterPage.css';
import moment from 'moment';

import { WithLoginState, WithCharacterDataOnly } from '../../hocs';
import { BodyType, HealthState } from 'sr2020-mm-event-engine';
import { DispiritComponent } from '../DispiritComponent';
import { dictionary, processForDisplay } from "../../utils";

interface CharacterPageProps extends WithCharacterDataOnly {
  setTitle: (title: string) => void;
}

const bodyTypeLabel: Record<BodyType, string> = {
  astral: dictionary.astralBody,
  physical: dictionary.physicalBody,
  drone: dictionary.droneBody,
  ectoplasm: dictionary.ectoplasmBody,
  vr: dictionary.vrBody,
}

const healthStateLabel: Record<HealthState, string> = {
  healthy: dictionary.healthy,
  wounded: dictionary.wounded,
  clinically_dead: dictionary.clinically_dead,
  biologically_dead: dictionary.biologically_dead,
}

export function CharacterPage(props: CharacterPageProps) {
  const { characterData, setTitle } = props;

  useEffect(() => {
    setTitle(dictionary.characterPageTitle);
  }, []);

  if (characterData === null) {
    return <div>{dictionary.characterDataLoading}</div>
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
          {dictionary.youCanWearSpiritTill}
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
          {dictionary.youReadSpiritMessage}{processForDisplay(characterData.spiritSuitState.message)}
        </div>
      }
      {
        characterData.messageData !== undefined &&
        characterData.messageData.message !== '' &&
        <div className="tw-m-4 tw-p-4 tw-bg-blue-200 tw-font-semibold">
          {
            moment(characterData.messageData.timestamp).format('HH:mm') + ' ' +
            processForDisplay(characterData.messageData.message)
          }
        </div>
      }
      {
        characterData.spiritSuitState !== undefined &&
        characterData.spiritSuitState.suitStatus !== 'normal' &&
        <div className="tw-m-4 tw-p-4 tw-bg-red-200 tw-font-semibold">
          {dictionary.returnYourBodyInTimeStart}
          {
            ' ' + moment(characterData.spiritSuitState.suitStatusChangeTime + 
            10 * 60 * 1000).format('HH:mm')
          }
          {dictionary.returnYourBodyInTimeEnd}
        </div>
      }
      <div className="tw-mb-2">
        <span className="tw-w-24 tw-inline-block">{dictionary.name}</span>
        <span>{processForDisplay(characterData.workModel.name)}</span>
      </div>
      <div className="tw-mb-2">
        <span className="tw-w-24 tw-inline-block tw-align-top">{dictionary.body}</span>
        <div className="tw-inline-block">
          <div>{bodyTypeLabel[characterData.workModel.currentBody]}</div>
          {
            characterData.spiritSuitState !== undefined &&
            <div>{dictionary.wearedSpirit} {characterData.spiritSuitState.spiritId} {processForDisplay(characterData.spiritSuitState.spiritName)}</div>
          }
        </div>
      </div>
      <div className="tw-mb-2">
        <span className="tw-w-24 tw-inline-block">{dictionary.healthState}</span>
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
