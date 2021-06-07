import React, { useCallback } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import { GameModel, SetEnableSpiritMovement, GetEnableSpiritMovement } from "sr2020-mm-event-engine";
import { WithTranslation } from 'react-i18next';
import { WithEnableSpiritMovement } from '../../../dataHOCs';
import './SpiritMovementSwitch.css';


interface SpiritMovementSwitchProps extends WithTranslation, WithEnableSpiritMovement {
  gameModel: GameModel;
};

export function SpiritMovementSwitch(props: SpiritMovementSwitchProps) {
  const {
    t, enableSpiritMovement, gameModel,
  } = props;

  const onClick = useCallback(() => {
    const tmp = gameModel.get2<GetEnableSpiritMovement>('enableSpiritMovement');
    gameModel.execute2<SetEnableSpiritMovement>({
      type: 'setEnableSpiritMovement',
      enableSpiritMovement: !tmp,
    });
  }, [gameModel]);
  return (
    <Dropdown.Item as="button" onClick={onClick}>
      <Form.Check
        type="switch"
        id="spiritMovementSwitch"
        label={t('calcSpiritMovement')}
        checked={enableSpiritMovement}
        className="tw-py-3 tw-text-lg"
      />
    </Dropdown.Item>
  );
}
