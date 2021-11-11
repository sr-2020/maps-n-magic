import React, { useEffect, useState } from 'react';
import './EmergencyDispiritPage.css';

import Button from "react-bootstrap/Button";
import { emergencyDispirit, logClientError } from '../../api';
import { isErrorResponse, stringifyError } from 'sr2020-mm-event-engine';
import { t } from "../../utils";

interface EmergencyDispiritPageProps {
  setTitle: (title: string) => void;
}

export function EmergencyDispiritPage(props: EmergencyDispiritPageProps) {
  const { setTitle } = props;

  useEffect(() => {
    setTitle(t('emergencyDispiritPageTitle'));
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
        setDispiritStatus(t('emergencyDispiritDone'));
      }
      setDoEmergencyDispirit(false);
    }).catch(err => {
      console.error(stringifyError(err));
      setDispiritStatus(t('unexpectedEmergencyDispiritError'));
      logClientError(t('unexpectedEmergencyDispiritError'), err);
      setDoEmergencyDispirit(false);
    });
  }, [doEmergencyDispirit]);

  return (
    <div className="EmergencyDispiritPage tw-p-4">
      <div className="tw-mb-8">
        <p className="tw-mb-4">
          {t('emergencyDispiritExplanation1')}
        </p>
        <p className="tw-mb-4">
          {t('emergencyDispiritExplanation2')}
        </p>
        <p>
          {t('emergencyDispiritExplanation3')}
        </p>
      </div>
      <div className="tw-text-center">
        <Button 
          variant="danger"
          onClick={() => setDoEmergencyDispirit(true)}
        >
          {t('confirmEmergencyDispirit')}
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



