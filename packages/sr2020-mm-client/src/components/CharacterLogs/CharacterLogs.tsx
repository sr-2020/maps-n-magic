import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import './CharacterLogs.css';
import moment from 'moment';


import { WithTranslation } from "react-i18next";

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

import { HistoryItem, OrgHistoryItem } from 'sr2020-mm-event-engine';
import { processForDisplay } from 'sr2020-mm-translations';

interface CharacterLogsProps extends WithTranslation {
}

export function CharacterLogs(props: CharacterLogsProps) {
  const { t } = props;
  const [characterId, setCharacterId] = useState<string>('');
  const [orgLog, setOrgLog] = useState<OrgHistoryItem[]>([]);
  const [userLog, setUserLog] = useState<HistoryItem[]>([]);

  const isValid = 
    characterId.trim() !== '' 
    && !Number.isNaN(Number(characterId));

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (!isValid) {
      return;
    }
    setOrgLog([]);
    setUserLog([]);
    const res = await fetch('/api/orgLogs/' + characterId.trim());
    const res2 = await res.json();
    setOrgLog(res2);

    const res3 = await fetch('/api/userLogs/' + characterId.trim());
    const res4 = await res3.json();
    setUserLog(res4);
  }

  return (
    <div className="CharacterLogs tw-p-8  tw-h-full tw-flex tw-flex-col tw-overflow-auto">
      <div className="tw-mb-8">
        <Form 
          className="tw-w-64"
          onSubmit={onSubmit}
        >
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>{t('characterId')}</Form.Label>
            <Form.Control value={characterId} onChange={(event: ChangeEvent<HTMLInputElement>) => {
              const { target: { value } } = event;
              setCharacterId(value);
            }}/>
          </Form.Group>
          <Button variant="primary" type="submit" disabled={!isValid}>
            {t('showLogs')}
          </Button>
        </Form>
      </div>
      <div className="tw-mb-8">
        <div className="tw-mb-4">{t('organizerLog')}</div>
        <div>
          <Table
            hover
            size="sm"
          >
            <thead>
              <tr>
                <th className="tw-text-right">Timestamp</th>
                <th>Type</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {
                orgLog.map(el => (
                  <tr key={el.timestamp}>
                    <td className="tw-text-right">{moment(new Date(el.timestamp)).format('D MMM YYYY HH:mm:ss')}</td>
                    <td>{el.type}</td>
                    <td>{processForDisplay(el.message)}</td>
                  </tr>
                ))
              }
            </tbody>
          </Table>
        </div>
      </div>
      <div>
        <div className="tw-mb-4">{t('playerLog')}</div>
        <div>
          <Table
            hover
            size="sm"
          >
            <thead>
              <tr>
                <th className="tw-text-right">Timestamp</th>
                <th>Title</th>
                <th>Text</th>
              </tr>
            </thead>
            <tbody>
              {
                userLog.map(el => (
                  <tr key={el.timestamp}>
                    <td className="tw-text-right">{moment(new Date(el.timestamp)).format('D MMM YYYY HH:mm:ss')}</td>
                    <td>{processForDisplay(el.data.title)}</td>
                    <td>{processForDisplay(el.data.text)}</td>
                  </tr>
                ))
              }
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}



