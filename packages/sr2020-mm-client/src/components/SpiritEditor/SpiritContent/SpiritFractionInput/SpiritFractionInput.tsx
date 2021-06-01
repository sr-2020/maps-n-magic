import React, { ChangeEvent } from 'react';
import './SpiritFractionInput.css';

import { WithTranslation } from "react-i18next";
import Form from 'react-bootstrap/Form';
import { GameModel } from "sr2020-mm-event-engine";

import { WithSpiritFractions } from '../../../../dataHOCs';

interface SpiritFractionInputProps extends WithTranslation, WithSpiritFractions {
  id: string;
  name: string;
  value: number;
  gameModel: GameModel;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function SpiritFractionInput(props: SpiritFractionInputProps) {
  const { value, spiritFractions, t, onChange, id, name } = props;

  if (spiritFractions === null) {
    return (
      <div className="SpiritContent tw-flex-grow">
        {t('spiritFractionsNotLoaded')}
      </div>
    );
  }

  return (
    <Form.Control 
      as="select" 
      className="SpiritFractionInput tw-w-2/4"
      id={id}
      name={name}
      value={value}
      onChange={onChange}
    >
      {
        spiritFractions.map((fraction) => (
          <option
            key={fraction.id}
            value={fraction.id}
          >
            {fraction.name}
          </option>
        ))
      }
    </Form.Control>
  );
}



