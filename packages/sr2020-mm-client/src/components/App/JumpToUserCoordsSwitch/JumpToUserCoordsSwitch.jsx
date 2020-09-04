import React, { Component } from 'react';
import './JumpToUserCoordsSwitch.css';

import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';

// import { JumpToUserCoordsSwitchPropTypes } from '../../types';

export function JumpToUserCoordsSwitch(props) {
  const {
    t, onClick, waitingForGeolocation, curPosition,
  } = props;
  return (
    <Dropdown.Item as="button" onClick={onClick}>
      <Form.Check
        type="switch"
        id="jumpToUserCoordsSwitch"
        label={t('jumpToUserCoords')}
        checked={curPosition !== null}
        disabled={waitingForGeolocation}
        className="tw-py-3 tw-text-lg"
        style={{ display: 'inline-block' }}
      />
      {
        waitingForGeolocation && (
          <FontAwesomeIcon
            className="tw-ml-2 tw-text-2xl tw-text-gray-700"
            icon={faSpinner}
            spin
          />
        )
      }
    </Dropdown.Item>
  );
}
