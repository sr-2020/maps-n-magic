import React, { useEffect, useState } from 'react';
import { isErrorResponse, HistoryItem } from 'sr2020-mm-event-engine';
import { loadHistory, suitSpirit } from '../../api';
import moment from 'moment';
import './HistoryPage.css';

interface HistoryPageProps {
  setTitle: (title: string) => void;
}

export function HistoryPage(props: HistoryPageProps) {
  const { setTitle } = props;

  useEffect(() => {
    setTitle(`История`);
  }, []);

  const [historyList, setHistoryList] = useState<HistoryItem[] | null>(null);
  const [suitSpiritStatus, setSuitSpiritStatus] = useState<string>('');
  
  useEffect(() => {
    if (historyList !== null) {
      return;
    }
    loadHistory().then(res => {
      if (isErrorResponse(res)) {
        setSuitSpiritStatus(res.errorTitle);
        setHistoryList([]);
      } else {
        setHistoryList(res);
      }
    }).catch(err => {
      console.error(err);
      setSuitSpiritStatus('CL Непредвиденная ошибка получения истории');
      setHistoryList([]);
    });
  }, [historyList]);

  return (
    <div className="HistoryPage">
      {
        historyList !== null &&
        historyList.map(item => 
          <div key={item.timestamp} className="tw-m-4">
            <div className="tw-flex tw-mb-2">
              <div className="tw-flex-1 tw-font-bold">{item.data.title}</div>
              <div className="tw-flex-0">{moment(item.timestamp).locale('ru-Ru').format('D MMM HH:mm')}</div>
            </div>
            <div className="tw-ml-4">{item.data.text}</div>
          </div>
        )
      }

      {
        suitSpiritStatus !== '' && 
        <>
          <div className="tw-m-4 tw-p-4 tw-bg-blue-200 tw-font-semibold">
            {suitSpiritStatus}
          </div>
        </>
      }
    </div>
  );
}
