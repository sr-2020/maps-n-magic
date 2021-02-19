import React, { Component, useCallback } from 'react';
import './WipeManaOceanEffectsButton.css';

import Dropdown from 'react-bootstrap/Dropdown';

export function WipeManaOceanEffectsButton(props) {
  const {
    t, gameModel,
  } = props;

  const onClick = useCallback(() => {
    gameModel.execute('wipeManaOceanEffects');
  }, [gameModel]);
  return (
    <Dropdown.Item
      as="button"
      type="button"
      data-original-title=""
      onClick={onClick}
      title={t('wipeManaOceanEffects')}
      className="tw-py-3 tw-text-lg"
    >
      {t('wipeManaOceanEffects')}
    </Dropdown.Item>
  );
}
