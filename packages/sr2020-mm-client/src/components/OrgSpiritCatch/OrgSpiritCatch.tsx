import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import './OrgSpiritCatch.css';

import { WithTranslation } from "react-i18next";

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { CatchSpiritInternalRequest } from 'sr2020-mm-event-engine';

interface OrgSpiritCatchProps extends WithTranslation {
}

export function OrgSpiritCatch(props: OrgSpiritCatchProps) {
  const [spiritId, setSpiritId] = useState<string>('');
  const [spiritJarId, setSpiritJarId] = useState<string>('');
  const [result, setResult] = useState<string>('');

  const isValid = 
    spiritId.trim() !== '' 
    && !Number.isNaN(Number(spiritId))
    && spiritJarId.trim() !== '' 
    && !Number.isNaN(Number(spiritJarId));

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (!isValid) {
      return;
    }
    const data: CatchSpiritInternalRequest = {
      characterId: -1,
      qrId: Number(spiritJarId.trim()),
      spiritId: Number(spiritId.trim())
    }
    const res = await fetch('/api/directCatchSpirit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    const res2 = await res.json();
    setResult(JSON.stringify(res2));
  }

  return (
    <div className="OrgSpiritCatch tw-p-8">
      <div className="tw-mb-8">
        <Form 
          className="tw-w-64"
          onSubmit={onSubmit}
        >
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Id духа</Form.Label>
            <Form.Control value={spiritId} onChange={(event: ChangeEvent<HTMLInputElement>) => {
              const { target: { value } } = event;
              setSpiritId(value);
            }}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Id тотема</Form.Label>
            <Form.Control value={spiritJarId} onChange={(event: ChangeEvent<HTMLInputElement>) => {
              const { target: { value } } = event;
              setSpiritJarId(value);
            }}/>
          </Form.Group>
          <Button variant="primary" type="submit" disabled={!isValid}>
            Отправить духа в тотем
          </Button>
        </Form>
      </div>
      <div>
        <div className="tw-mb-4">Результат:</div>
        <div>{result}</div>
      </div>
    </div>
  );
}
