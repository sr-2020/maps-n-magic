import React, { useState, useEffect } from 'react';
import * as R from 'ramda';
import './SpiritCatchers.css';
import moment from 'moment';

import { WithTranslation } from "react-i18next";
import { CatcherData, CatcherStates } from 'sr2020-mm-event-engine';
import { SERVER_URL } from 'sr2020-mm-client-event-engine';

import Table from 'react-bootstrap/Table';

interface SpiritCatchersProps extends WithTranslation {
}

export function SpiritCatchers(props: SpiritCatchersProps) {
  const [catcherStates, setCatcherStates] = useState<CatcherStates>({});

  useEffect(() => {
    fetch(SERVER_URL + '/api/catcherStates')
      .then(res => res.json())
      .then((res: CatcherStates) => {
        setCatcherStates(res);
      })
      .catch(err => console.error(err));
    const timeInterval = setInterval(() => {
      fetch(SERVER_URL + '/api/catcherStates')
        .then(res => res.json())
        .then((res: CatcherStates) => {
          setCatcherStates(res);
        })
        .catch(err => console.error(err));
    }, 15000);
    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  const data = Object.entries(catcherStates).reduce((acc: (CatcherData & {id: number})[], [key, value]) => {
    acc.push({
      id: Number(key),
      ...value
    })
    return acc;
  }, []);

  const data2 = R.sortBy(R.prop('id'), data);

  // const data2 = R.repeat({
  //   id: 51617,
  //   "startTime":1627458775962,
  //   "durationMillis":1200000,
  //   "catchProbability":90,
  //   "attemptNumber":3
  // }, 34);

  return (
    <div className="SpiritCatchers tw-p-8 tw-h-full tw-flex tw-flex-col tw-overflow-auto">
      <Table
        hover
        size="sm"
        // className="tw-w-auto"
      >
        <thead>
          <tr>
            <th>id персонажа</th>
            <th className="tw-text-right">Начало заклинания</th>
            <th className="tw-text-right">Окончание заклинания</th>
            <th className="tw-text-right">Вероятность поимки, %</th>
            <th className="tw-text-right">Число попыток</th>
          </tr>
        </thead>
        <tbody>
          {
            data2.map(el => (
              <tr key={el.id}>
                <td>{el.id}</td>
                <td className="tw-text-right">{moment(new Date(el.startTime)).format('D MMM YYYY HH:mm:ss')}</td>
                <td className="tw-text-right">{moment(new Date(el.startTime + el.durationMillis)).format('D MMM YYYY HH:mm:ss')}</td>
                <td className="tw-text-right">{el.catchProbability}</td>
                <td className="tw-text-right">{el.attemptNumber}</td>
              </tr>
            ))
          }
        </tbody>
      </Table>
    </div>
  );
}



