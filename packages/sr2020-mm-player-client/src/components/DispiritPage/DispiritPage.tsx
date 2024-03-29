import React, { useEffect, useState } from 'react';
import { CharacterModelData2, isErrorResponse, consequenceTexts, stringifyError } from 'sr2020-mm-event-engine';
import { dispirit, isBodyStorageValid, isSpiritJarValid, logClientError } from '../../api';
import { QrScannerWrapper } from '../QrScannerWrapper';
import './DispiritPage.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';
import { StatusIcon } from '../StatusIcon';
import { t } from "../../utils";

interface DispiritPageProps {
  setTitle: (title: string) => void;
  characterData: CharacterModelData2;
}

export type BodyStorageStatus2 = {
  status: 'valid';
} | {
  status: 'invalid';
  message: string;
} | {
  status: 'unknown';
};

type SpiritJarStatus2 = {
  status: 'valid';
} | {
  status: 'invalid';
  message: string;
} | {
  status: 'unknown';
};

export function DispiritPage(props: DispiritPageProps) {
  const { setTitle, characterData } = props;

  useEffect(() => {
    setTitle(t('dispiritPageTitle'));
  }, []);

  // 366 non body storage
  // const [bodyStorageQrString, setBodyStorageQrString] = useState<string | null>('01deAQCccuZg366');

  // 367 empty body storage
  // const [bodyStorageQrString, setBodyStorageQrString] = useState<string | null>('3c8eAQBobuZg367');

  // 360 full body storage
  // const [bodyStorageQrString, setBodyStorageQrString] = useState<string | null>('bd1bAQBYa+Zg360');

  const [bodyStorageQrString, setBodyStorageQrString] = useState<string | null>(null);
  const [scanBodyStorage, setScanBodyStorage] = useState<boolean>(false);
  const [bodyStorageStatus, setBodyStorageStatus] = useState<BodyStorageStatus2>({status: 'unknown'});

  // const [messageBody, setMessageBody] = useState<string>('');

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

  // 366 non spirit jar
  // const [spiritJarQrString, setSpiritJarQrString] = useState<string | null>('01deAQCccuZg366');

  // 359 full spirit jar
  // const [spiritJarQrString, setSpiritJarQrString] = useState<string | null>('13d7AQD9cuZg359');

  // 370 empty spirit jar
  // const [spiritJarQrString, setSpiritJarQrString] = useState<string | null>('767bAQAzc+Zg370');

  const [spiritJarQrString, setSpiritJarQrString] = useState<string | null>(null);
  const [scanSpiritJar, setScanSpiritJar] = useState<boolean>(false);
  const [spiritJarStatus, setSpiritJarStatus] = useState<SpiritJarStatus2>({status: 'unknown'});

  useEffect(() => {
    if (spiritJarQrString === null) {
      return;
    }
    isSpiritJarValid(spiritJarQrString, true).then(res => {
      if (isErrorResponse(res)) {
        setSpiritJarStatus({
          status: 'invalid',
          message: res.errorTitle
        });
      } else {
        setSpiritJarStatus({ status: 'valid' });
      }
    }).catch(err => {
      console.error(stringifyError(err));
      logClientError(t('unexpectedSpiritJarCheckError'), err);
      setBodyStorageStatus({
        status: 'invalid',
        message: t('unexpectedSpiritJarCheckError')
      });
    });
  }, [spiritJarQrString]);

  const [doDispirit, setDoDispirit] = useState<boolean | null>(null);
  const [dispiritStatus, setDispiritStatus] = useState<string>('');

  useEffect(() => {
    if (doDispirit === null || bodyStorageQrString === null) {
      return;
    }
    // messageBody
    dispirit(bodyStorageQrString, doDispirit ? spiritJarQrString : null, '').then(res => {
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

  if (scanSpiritJar) {
    return (
      <QrScannerWrapper
        onSuccess={(qrData: string) => {
          setSpiritJarQrString(qrData);
          setScanSpiritJar(false);
        }}
        message={t('scanEmptySpiritJar')}
        onCancel={() => setScanSpiritJar(false)}
      />
    );
  }

  const isValid = 
    spiritJarStatus.status === 'valid' && 
    bodyStorageStatus.status === 'valid';

  const isNormal = characterData.spiritSuitState?.suitStatus === 'normal';
  return (
    <div className="DispiritPage tw-p-4 tw-pl-16">
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
      </div>
      {
        isNormal &&
        <div className="tw-mb-8">
          <div className="tw-flex tw-mb-4">
            <StatusIcon status={spiritJarStatus.status}/>
            <div className="col-form-label tw-flex-1">{t('spiritJar')}</div>
            <Button onClick={() => setScanSpiritJar(true)}>{t('scan')}</Button>
          </div>
          {
            spiritJarStatus.status === 'invalid' && 
            <div className="tw-m-4">
              {spiritJarStatus.message}
            </div>
          }
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
          {t('dispiritAndFree')}
        </Button>
      </div>
      {
        isNormal &&
        <div className="tw-text-right">
          <Button disabled={!isValid || doDispirit !== null} onClick={() => setDoDispirit(true)}>
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
      }
    </div>
  );
}



