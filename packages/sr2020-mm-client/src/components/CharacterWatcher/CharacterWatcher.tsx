import * as R from 'ramda';
import React, { FormEvent, MouseEvent, useEffect } from 'react';
import './CharacterWatcher.css';
import { WithCharacterId, WithCharacterPosition, WithUserRecords } from '../../dataHOCs';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { WithTranslation } from 'react-i18next';

import { CharacterDataList } from '../CharacterDataList';
import { UserRecord, GameModel } from "sr2020-mm-event-engine";
import { SetTrackedCharacterId } from "sr2020-mm-client-event-engine";

const WATCH_CHARACTER_HISTORY_KEY = 'watchCharacterHistory';

interface CharacterWatcherProps extends 
  WithCharacterId, 
  WithCharacterPosition, 
  WithUserRecords,
  WithTranslation {
  gameModel: GameModel;
  children: React.ReactNode;
}

// eslint-disable-next-line max-lines-per-function
export function CharacterWatcher(props: CharacterWatcherProps) {
  const {
    trackedCharacterId, 
    userRecords, 
    gameModel, 
    children, 
    trackedCharacterLocationId,
    t
  } = props;

  const userIds = R.pluck('id', userRecords);

  const watchCharacterHistoryStr = localStorage.getItem(WATCH_CHARACTER_HISTORY_KEY);

  let watchCharacterHistory: number[] = [];
  if (watchCharacterHistoryStr) {
    watchCharacterHistory = JSON.parse(watchCharacterHistoryStr);
  }

  function onWatchCancel() {
    gameModel.execute2<SetTrackedCharacterId>({
      type: 'setTrackedCharacterId',
      trackedCharacterId: null,
    });
  }

  useEffect(() => {
    return () => {
      onWatchCancel();
    }
  }, []);

  function onReselectCharacter(e: MouseEvent<HTMLElement>) {
    // eslint-disable-next-line no-shadow
    const { characterId } = e.currentTarget.dataset;
    gameModel.execute2<SetTrackedCharacterId>({
      type: 'setTrackedCharacterId',
      trackedCharacterId: Number(characterId),
    });
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    e.stopPropagation();
    e.preventDefault();
    const characterId2 = Number(form.characterId.value.trim());
    if (!userIds.includes(characterId2)) {
      console.warn('character is absent');
      return;
    }

    gameModel.execute2<SetTrackedCharacterId>({
      type: 'setTrackedCharacterId',
      trackedCharacterId: characterId2,
    });
    if (!watchCharacterHistory.includes(characterId2)) {
      watchCharacterHistory.push(characterId2);
    }

    if (watchCharacterHistory.length > 10) {
      watchCharacterHistory.shift();
    }

    localStorage.setItem(WATCH_CHARACTER_HISTORY_KEY, JSON.stringify(watchCharacterHistory));
  }

  return (
    <>

      {
        !trackedCharacterId
        && (
          <>
            <Form
              className="tw-mx-auto tw-mb-8"
              style={{ width: '20rem' }}
              onSubmit={onSubmit}
            >
              <Form.Group controlId="characterId">
                <Form.Label>{t('enterCharacterId')}</Form.Label>
                <Form.Control list="characterIdList" />
              </Form.Group>
              <div className="tw-text-right">
                <Button variant="primary" type="submit">
                  {t('followCharacterLocationAndSound')}
                </Button>
              </div>
            </Form>
            <CharacterDataList users={userRecords} />
            {
              watchCharacterHistory.length > 0
            && (
              <Form.Group
                className="tw-mx-auto"
                style={{ width: '20rem' }}
              >
                <Form.Label>{t('prevSelectedCharacters')}</Form.Label>
                <div>
                  {
                    watchCharacterHistory.map((el) => (
                      <Button
                        key={el}
                        variant="primary"
                        className="tw-mr-4 tw-mb-4"
                        data-character-id={el}
                        onClick={onReselectCharacter}
                      >
                        {el}
                      </Button>
                    ))
                  }
                </div>
              </Form.Group>
            )
            }

          </>
        )
      }

      {
        trackedCharacterId
      && (
        <>
          {children}
          <div className="tw-fixed tw-bottom-0 tw-left-0" style={{ zIndex: 10000 }}>
            {t('characterIdLabel', {id: trackedCharacterId})}
            <br />
            {t('locationIdLabel', {id: trackedCharacterLocationId || 'N/A'})}
            <br />

            <Button variant="primary" onClick={onWatchCancel}>
              {t('stopFollowing')}
            </Button>
          </div>
        </>
      )
      }
    </>
  );
}
