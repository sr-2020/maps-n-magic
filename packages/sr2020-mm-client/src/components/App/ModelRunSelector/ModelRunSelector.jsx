import React, { Component, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './ModelRunSelector.css';

import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

const speeds = [0.1, 1, 10, 20];

export function ModelRunSelector (props) {

  const { t } = useTranslation();
  const { gameModel } = props;

  const [runState, setRunState] = useState({
    isModelRunning: false,
    speed: null,
  });

  function refresh() {
    setRunState({
      isModelRunning: gameModel.get('isModelRunning'),
      speed: gameModel.get('modelSpeed'),
    });
  }

  useEffect(refresh, [gameModel]);

  useEffect(() => {
    console.log("on subscribe ModelRunSelector");
    gameModel.on('modelRunningChange', refresh);
    return () => {
      console.log("off subscribe ModelRunSelector");
      gameModel.off('modelRunningChange', refresh);
    };
  }, []);

  function onClick(type, speed) {
    return () => {
      gameModel.execute({
        type,
        speed,
      });
    };
  }

  return (
    <>
      <Dropdown.Item
        as="button"
        type="button"
        data-original-title=""
        onClick={onClick('stopModel')}
        className="ModelRunSelector tw-py-3 tw-text-lg"
      >
        <FontAwesomeIcon
          className={classNames('tw-mr-1 tw-text-base tw-w-4 tw-h-4 ', {
            invisible: runState.isModelRunning,
          })}
          fixedWidth
          icon={faCheck}
        />
        {t('stopModelRun')}
      </Dropdown.Item>
      {
        speeds.map((speed2) => (

          <Dropdown.Item
            key={speed2}
            as="button"
            type="button"
            data-original-title=""
            onClick={onClick('runModel', speed2)}
            className="ModelRunSelector tw-py-3 tw-text-lg"
          >
            <FontAwesomeIcon
              className={classNames('tw-mr-1 tw-text-base tw-w-4 tw-h-4 ', {
                invisible: !runState.isModelRunning || speed2 !== runState.speed,
              })}
              fixedWidth
              icon={faCheck}
            />
            {t('startModelRun', { speed: speed2 })}
          </Dropdown.Item>
        ))
      }
    </>
  );
}
