import React, { Component } from 'react';
import './MovementSimulatorSwitch.css';

import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
// import { MovementSimulatorSwitchPropTypes } from '../../types';

export function MovementSimulatorSwitch(props) {
  const {
    t, onClick, simulateGeoDataStream,
  } = props;
  return (
    <Dropdown.Item as="button" onClick={onClick}>
      <Form.Check
        type="switch"
        id="movementSimulatorSwitch"
        label={t('simulateMovement')}
        checked={simulateGeoDataStream}
        className="py-3 text-xl"
      />
    </Dropdown.Item>
  );
}
