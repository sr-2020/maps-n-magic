import React, { Component, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import './WipeManaOceanEffectsButton.css';

import Dropdown from 'react-bootstrap/Dropdown';
import { GameModel } from "sr2020-mm-event-engine";

interface WipeManaOceanEffectsButtonProps {
  gameModel: GameModel;
}

export function WipeManaOceanEffectsButton(props: WipeManaOceanEffectsButtonProps) {
  const {
    gameModel,
  } = props;
  const { t } = useTranslation();

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
