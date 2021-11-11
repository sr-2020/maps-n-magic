import React, { useEffect } from 'react';
import { useState } from 'react';
import { consequenceTexts, isErrorResponse, stringifyError } from 'sr2020-mm-event-engine';
import { dispirit, isBodyStorageValid, logClientError } from '../../api';
import { BodyStorageStatus2 } from '../DispiritPage/DispiritPage';
import { QrScannerWrapper } from '../QrScannerWrapper';
import { StatusIcon } from '../StatusIcon';
import './DispiritComponent.css';
import { t } from "../../utils";

import Button from "react-bootstrap/Button";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

interface DispiritComponentProps {
}

export function DispiritComponent(props: DispiritComponentProps) {
  const [bodyStorageQrString, setBodyStorageQrString] = useState<string | null>(null);
  const [scanBodyStorage, setScanBodyStorage] = useState<boolean>(false);
  const [bodyStorageStatus, setBodyStorageStatus] = useState<BodyStorageStatus2>({status: 'unknown'});

  useEffect(() => {
    if (bodyStorageQrString === null) {
      return;
    }
    isBodyStorageValid(bodyStorageQrString, false).then(res => {
      if (isErrorResponse(res)) {
        setBodyStorageStatus({
          status: 'invalid',
          message: res.errorTitle
        });
      } else {
        setBodyStorageStatus({ status: 'valid' });
      }
    }).catch(err => {
      console.error(stringifyError(err));
      logClientError(t('unexpectedBodyStorageCheckError'), err);
      setBodyStorageStatus({
        status: 'invalid',
        message: t('unexpectedBodyStorageCheckError')
      });
    });
  }, [bodyStorageQrString]);

  const [doDispirit, setDoDispirit] = useState<boolean | null>(null);
  const [dispiritStatus, setDispiritStatus] = useState<string>('');

  useEffect(() => {
    if (doDispirit === null || bodyStorageQrString === null) {
      return;
    }
    dispirit(bodyStorageQrString, null, '').then(res => {
      if (isErrorResponse(res)) {
        setDispiritStatus(res.errorTitle);
      } else {
        setDispiritStatus('');
      }
      setDoDispirit(null);
    }).catch(err => {
      console.error(stringifyError(err));
      logClientError(t('unexpectedDispiritError'), err);
      setDispiritStatus(t('unexpectedDispiritError'));
      setDoDispirit(null);
    });
  }, [doDispirit]);

  if (scanBodyStorage) {
    return (
      <QrScannerWrapper
        onSuccess={(qrData: string) => {
          setBodyStorageQrString(qrData);
          setScanBodyStorage(false);
        }}
        message={t('scanBodyStorage')}
        onCancel={() => setScanBodyStorage(false)}
      />
    );
  }

  const isValid = bodyStorageStatus.status === 'valid';

  return (
    <div className="DispiritComponent tw-p-4 tw-pl-16">
      <div className="tw-mb-8">
        <div className="tw-flex tw-mb-4">
          <StatusIcon status={bodyStorageStatus.status}/>
          <div className="col-form-label tw-flex-1">{t('bodyStorage')}</div>
          <Button onClick={() => setScanBodyStorage(true)}>{t('scan')}</Button>
        </div>
        {
          bodyStorageStatus.status === 'invalid' && 
          <div>
            {bodyStorageStatus.message}
          </div>
        }
        {
          dispiritStatus !== '' && 
          <div className="tw-m-4">{dispiritStatus}</div>
        }
        <div className="tw-text-right tw-mb-8 tw-mt-12">
          <Button 
            disabled={!(bodyStorageStatus.status === 'valid') || doDispirit !== null} 
            onClick={() => setDoDispirit(false)}
          >
            <FontAwesomeIcon
              className={classNames("tw-mr-2 ", {
                'tw-hidden': doDispirit === null,
              })}
              icon={faSpinner}
              spin
            />
            {t('dispirit')}
          </Button>
        </div>
      </div>
    </div>
  );
}



