import React, { useEffect, useState } from 'react';
import './EmergencyDispiritPage.css';

import Button from "react-bootstrap/Button";
import { emergencyDispirit } from '../../api';
import { isErrorResponse } from 'sr2020-mm-event-engine';

interface EmergencyDispiritPageProps {
  setTitle: (title: string) => void;
}

export function EmergencyDispiritPage(props: EmergencyDispiritPageProps) {
  const { setTitle } = props;

  useEffect(() => {
    setTitle(`Тело духа уничтожено`);
  }, []);
  
  const [doEmergencyDispirit, setDoEmergencyDispirit] = useState<boolean>(false);
  const [dispiritStatus, setDispiritStatus] = useState<string>('');

  useEffect(() => {
    if (doEmergencyDispirit === false) {
      return;
    }
    emergencyDispirit().then(res => {
      if (isErrorResponse(res)) {
        setDispiritStatus(res.errorTitle);
      } else {
        setDispiritStatus("Способности духа сняты. Надо быстрее вернуться в своё тело");
      }
      setDoEmergencyDispirit(false);
    }).catch(err => {
      console.error(err);
      setDispiritStatus('Непредвиденная ошибка');
      setDoEmergencyDispirit(false);
    });
  }, [doEmergencyDispirit]);

  return (
    <div className="EmergencyDispiritPage tw-p-4">
      <div className="tw-mb-8">
        <p className="tw-mb-4">
          Экстренное снятие духа происходит если хиты духа ушли в ноль.
        </p>
        <p className="tw-mb-4">
          Вы остаетесь в теле духа, но теряете все способности и 
          идете надевать мясное тело. 
        </p>
        <p>
          Полноценное снятие тела духа выполняется как обычное снятие.
        </p>
      </div>
      <div className="tw-text-center">
        <Button 
          variant="danger"
          onClick={() => setDoEmergencyDispirit(true)}
        >
          Подтвердить экстренное снятие
        </Button>
      </div>
      {
        dispiritStatus !== '' && 
        <div className="tw-m-4 tw-p-4 tw-bg-red-200 tw-font-semibold">
          {dispiritStatus}
        </div>
      }
    </div>
  );
}



