import React, { Component } from 'react';
import './MovementSimulatorSwitch.css';

import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import { useTranslation } from 'react-i18next';

interface MovementSimulatorSwitchProps {
  onClick: (e: React.MouseEvent) => void;
  simulateGeoDataStream: boolean;
}

export function MovementSimulatorSwitch(props: MovementSimulatorSwitchProps) {
  const {
    onClick, simulateGeoDataStream,
  } = props;
  const { t } = useTranslation();
  return (
    <Dropdown.Item as="button" onClick={onClick}>
      <Form.Check
        type="switch"
        id="movementSimulatorSwitch"
        label={t('simulateMovement')}
        checked={simulateGeoDataStream}
        className="tw-py-3 tw-text-lg"
      />
    </Dropdown.Item>
  );
}
