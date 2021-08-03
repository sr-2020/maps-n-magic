import React, { useCallback } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import { GameModel, SetEnableManaOcean, GetEnableManaOcean } from "sr2020-mm-event-engine";
import { WithTranslation } from 'react-i18next';
import './ManaOceanSwitch.css';


interface ManaOceanSwitchProps extends WithTranslation {
  enableManaOcean: boolean;
  gameModel: GameModel;
};

export function ManaOceanSwitch(props: ManaOceanSwitchProps) {
  const {
    t, enableManaOcean, gameModel,
  } = props;

  const onClick = useCallback(() => {
    const tmp = gameModel.get2<GetEnableManaOcean>('enableManaOcean');
    gameModel.execute2<SetEnableManaOcean>({
      type: 'setEnableManaOcean',
      enableManaOcean: !tmp,
    });
  }, [gameModel]);
  return (
    <Dropdown.Item as="button" onClick={onClick}>
      <Form.Check
        type="switch"
        id="manaOceanSwitch"
        label={t('calcManaOcean')}
        checked={enableManaOcean}
        className="tw-py-3 tw-text-lg"
      />
    </Dropdown.Item>
  );
}
