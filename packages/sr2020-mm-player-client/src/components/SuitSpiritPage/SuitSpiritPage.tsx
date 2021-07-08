import React, { useEffect, useState } from 'react';
import './SuitSpiritPage.css';

import Button from "react-bootstrap/Button";
import { QrScannerWrapper } from '../QrScannerWrapper';
import { isBodyStorageValid, isSpiritJarValid } from '../../api';
import { isErrorResponse } from 'sr2020-mm-event-engine';

interface SuitSpiritPageProps {
}

type BodyStorageStatus = {
  status: 'valid';
} | {
  status: 'invalid';
  message: string;
} | {
  status: 'unknown';
};

type SpiritJarStatus = {
  status: 'valid';
  spirit: any;
} | {
  status: 'invalid';
  message: string;
} | {
  status: 'unknown';
};

export function SuitSpiritPage(props: SuitSpiritPageProps) {
  // 366 non body storage
  // const [bodyStorageQrString, setBodyStorageQrString] = useState<string | null>('01deAQCccuZg366');

  // 367 empty body storage
  // const [bodyStorageQrString, setBodyStorageQrString] = useState<string | null>('3c8eAQBobuZg367');

  // 360 full body storage
  // const [bodyStorageQrString, setBodyStorageQrString] = useState<string | null>('bd1bAQBYa+Zg360');

  const [bodyStorageQrString, setBodyStorageQrString] = useState<string | null>(null);
  const [scanBodyStorage, setScanBodyStorage] = useState<boolean>(false);
  const [bodyStorageStatus, setBodyStorageStatus] = useState<BodyStorageStatus>({status: 'unknown'});

  useEffect(() => {
    if (bodyStorageQrString === null) {
      return;
    }
    isBodyStorageValid(bodyStorageQrString).then(res => {
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
  const [spiritJarStatus, setSpiritJarStatus] = useState<BodyStorageStatus>({status: 'unknown'});

  useEffect(() => {
    if (spiritJarQrString === null) {
      return;
    }
    isSpiritJarValid(spiritJarQrString).then(res => {
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

  if (scanBodyStorage) {
    return (
      <QrScannerWrapper
        onSuccess={setBodyStorageQrString}
        message="Отсканируйте телохранилище"
        onCancel={() => setScanBodyStorage(false)}
      />
    );
  }

  if (scanSpiritJar) {
    return (
      <QrScannerWrapper
        onSuccess={setSpiritJarQrString}
        message="Отсканируйте тотем с духом"
        onCancel={() => setScanSpiritJar(false)}
      />
    );
  }

  const isValid = 
    spiritJarStatus.status === 'valid' && 
    bodyStorageStatus.status === 'valid';

  return (
    <div className="SuitSpiritPage">
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
        isValid &&
        <div>
          Время ношения духа 30 минут
        </div>
      }
      <Button disabled={!isValid}>Надеть</Button>
    </div>
  );
}



