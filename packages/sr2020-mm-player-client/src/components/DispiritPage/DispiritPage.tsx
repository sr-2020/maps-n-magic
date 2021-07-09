import React, { useEffect, useState } from 'react';
import { isErrorResponse } from 'sr2020-mm-event-engine';
import { dispirit, isBodyStorageValid, isSpiritJarValid } from '../../api';
import { QrScannerWrapper } from '../QrScannerWrapper';
import './DispiritPage.css';

import Button from "react-bootstrap/Button";

interface DispiritPageProps {
}

type BodyStorageStatus2 = {
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
  // const { t } = props;

  // 366 non body storage
  // const [bodyStorageQrString, setBodyStorageQrString] = useState<string | null>('01deAQCccuZg366');

  // 367 empty body storage
  // const [bodyStorageQrString, setBodyStorageQrString] = useState<string | null>('3c8eAQBobuZg367');

  // 360 full body storage
  // const [bodyStorageQrString, setBodyStorageQrString] = useState<string | null>('bd1bAQBYa+Zg360');

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
      console.error(err);
      setBodyStorageStatus({
        status: 'invalid',
        message: 'Непредвиденная ошибка'
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
      console.error(err);
      setBodyStorageStatus({
        status: 'invalid',
        message: 'Непредвиденная ошибка'
      });
    });
  }, [spiritJarQrString]);

  const [doDispirit, setDoDispirit] = useState<boolean>(false);
  const [dispiritStatus, setDispiritStatus] = useState<string>('');

  useEffect(() => {
    if (doDispirit === false || bodyStorageQrString === null || spiritJarQrString === null) {
      return;
    }
    dispirit(bodyStorageQrString, spiritJarQrString).then(res => {
      if (isErrorResponse(res)) {
        setDispiritStatus(res.errorTitle);
      } else {
        setDispiritStatus("Дух снят");
      }
      setDoDispirit(false);
    }).catch(err => {
      console.error(err);
      setDispiritStatus('Непредвиденная ошибка');
      setDoDispirit(false);
    });
  }, [doDispirit]);

  if (scanBodyStorage) {
    return (
      <QrScannerWrapper
        onSuccess={(qrData: string) => {
          setBodyStorageQrString(qrData);
          setScanBodyStorage(false);
        }}
        message="Отсканируйте телохранилище"
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
        message="Отсканируйте тотем с духом"
        onCancel={() => setScanSpiritJar(false)}
      />
    );
  }

  const isValid = 
    spiritJarStatus.status === 'valid' && 
    bodyStorageStatus.status === 'valid';

  return (
    <div className="DispiritPage">
      <div>
        <div>
          <span>Телохранилище</span>
          {
            bodyStorageStatus.status === 'valid' && <div>OK</div>
          }
          <Button onClick={() => setScanBodyStorage(true)}>Сканировать</Button>
        </div>
        {
          bodyStorageStatus.status === 'invalid' && 
          <div>
            {bodyStorageStatus.message}
          </div>
        }
      </div>
      <div>
        <div>
          <span>Тотем</span>
          {
            spiritJarStatus.status === 'valid' && <div>OK</div>
          }
          <Button onClick={() => setScanSpiritJar(true)}>Сканировать</Button>
        </div>
        {
          spiritJarStatus.status === 'invalid' && 
          <div>
            {spiritJarStatus.message}
          </div>
        }
      </div>
      {
        dispiritStatus !== '' && 
        <div>{dispiritStatus}</div>
      }
      <Button disabled={!isValid} onClick={() => setDoDispirit(true)}>Снять</Button>
    </div>
  );
}



