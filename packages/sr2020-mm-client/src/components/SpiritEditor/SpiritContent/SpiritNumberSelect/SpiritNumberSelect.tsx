import React, { ChangeEvent } from 'react';
import './SpiritNumberSelect.css';

import { WithTranslation } from "react-i18next";

import Form from 'react-bootstrap/Form';

interface SpiritNumberSelectProps extends WithTranslation {
  id: string;
  name: string;
  value: number;
  domain: number[];
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function SpiritNumberSelect(props: SpiritNumberSelectProps) {
  const { value, domain, t, onChange, id, name } = props;

  return (
    <Form.Control 
      as="select" 
      className="SpiritNumberSelect tw-w-2/4"
      id={id}
      name={name}
      value={value}
      onChange={onChange}
    >
      {
        domain.map((val) => (
          <option
            key={val}
            value={val}
          >
            {val}
          </option>
        ))
      }
    </Form.Control>
  );
}



