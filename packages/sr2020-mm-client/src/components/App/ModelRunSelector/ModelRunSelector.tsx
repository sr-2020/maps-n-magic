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
import { WithModelRunData } from "./withModelRunData";

const speeds = [0.1, 1, 10, 20];

export function ModelRunSelector(props: WithModelRunData) {
  const { isModelRunning, speed, onClick } = props;
  const { t } = useTranslation();
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
            invisible: isModelRunning,
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
                invisible: !isModelRunning || speed2 !== speed,
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
