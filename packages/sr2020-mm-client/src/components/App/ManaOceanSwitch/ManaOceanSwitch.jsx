import React, { useCallback } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import './ManaOceanSwitch.css';

export function ManaOceanSwitch(props) {
  const {
    t, enableManaOcean, gameModel,
  } = props;

  const onClick = useCallback(() => {
    const tmp = gameModel.get('enableManaOcean');
    gameModel.execute({
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
