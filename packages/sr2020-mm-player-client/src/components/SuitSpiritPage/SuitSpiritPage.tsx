import React, { useEffect, useState } from 'react';
import './SuitSpiritPage.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

import Button from "react-bootstrap/Button";
import { QrScannerWrapper } from '../QrScannerWrapper';
import { isBodyStorageValid, isSpiritJarValid, logClientError, refreshCharacterModel, suitSpirit } from '../../api';
import { 
  CharacterModelData2,
  isErrorResponse, Spirit, 
  getSuitSpiritDurationItems,
  hasAbility,
  Ability,
  stringifyError
  // SpiritDataForQrValidation 
} from 'sr2020-mm-event-engine';
import { SpiritCard } from '../SpiritCard';

import { StatusIcon } from '../StatusIcon';

interface SuitSpiritPageProps {
  setTitle: (title: string) => void;
  characterData: CharacterModelData2;
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
  spirit: Spirit;
} | {
  status: 'invalid';
  message: string;
} | {
  status: 'unknown';
};

export function SuitSpiritPage(props: SuitSpiritPageProps) {
  const { setTitle, characterData } = props;

  useEffect(() => {
    setTitle(`Надеть духа`);
  }, []);
  
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
    isBodyStorageValid(bodyStorageQrString, true).then(res => {
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
      logClientError('CL Непредвиденная ошибка проверки телохранилища', err);
      setBodyStorageStatus({
        status: 'invalid',
        message: 'CL Непредвиденная ошибка проверки телохранилища'
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
  const [spiritJarStatus, setSpiritJarStatus] = useState<SpiritJarStatus>({status: 'unknown'});

  useEffect(() => {
    if (spiritJarQrString === null) {
      return;
    }
    isSpiritJarValid(spiritJarQrString, false).then(res => {
      if (isErrorResponse(res)) {
        setSpiritJarStatus({
          status: 'invalid',
          message: res.errorTitle
        });
      } else {
        setSpiritJarStatus({ status: 'valid', spirit: res });
      }
    }).catch(err => {
      console.error(stringifyError(err));
      logClientError('CL Непредвиденная ошибка проверки тотема', err);
      setBodyStorageStatus({
        status: 'invalid',
        message: 'CL Непредвиденная ошибка проверки тотема'
      });
    });
  }, [spiritJarQrString]);

  const [doSuitSpirit, setDoSuitSpirit] = useState<boolean>(false);
  const [suitSpiritStatus, setSuitSpiritStatus] = useState<string>('');

  useEffect(() => {
    if (doSuitSpirit === false || bodyStorageQrString === null || spiritJarQrString === null) {
      return;
    }
    suitSpirit(bodyStorageQrString, spiritJarQrString).then(res => {
      if (isErrorResponse(res)) {
        setSuitSpiritStatus(res.errorTitle);
      } else {
        setSuitSpiritStatus("Дух надет");
      }
      setDoSuitSpirit(false);
    }).catch(err => {
      console.error(stringifyError(err));
      logClientError('CL Непредвиденная ошибка надевания духа', err);
      setSuitSpiritStatus('CL Непредвиденная ошибка надевания духа');
      setDoSuitSpirit(false);
    });
  }, [doSuitSpirit]);

  if (!hasAbility(characterData, Ability.SuitUp)) {
    return (
      <div className="tw-m-4 tw-p-4 tw-bg-blue-200 tw-font-semibold">
        Вы не овладели навыком Suit Up (A), поэтому не можете надеть духа
      </div>
    );
  }

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

  const timeInSpirit = 30 * getSuitSpiritDurationItems(characterData);

  return (
    <div className="SuitSpiritPage tw-p-4 tw-pl-16">
      <div className="tw-mb-8">
        <div className="tw-flex tw-mb-4">
          <StatusIcon status={bodyStorageStatus.status}/>
          <div className="col-form-label tw-flex-1">Телохранилище</div>
          <Button onClick={() => setScanBodyStorage(true)}>Сканировать</Button>
        </div>
        {
          bodyStorageStatus.status === 'invalid' && 
          <div>
            {bodyStorageStatus.message}
          </div>
        }
      </div>
      <div className="tw-mb-8">
        <div className="tw-flex tw-mb-4">
          <StatusIcon status={spiritJarStatus.status}/>
          <div className="col-form-label tw-flex-1">Тотем</div>
          <Button onClick={() => setScanSpiritJar(true)}>Сканировать</Button>
        </div>
        {
          spiritJarStatus.status === 'invalid' && 
          <div>
            {spiritJarStatus.message}
          </div>
        }
        {
          spiritJarStatus.status === 'valid' && <div>
            <SpiritCard
              className="tw-m-4"
              spirit={spiritJarStatus.spirit} 
              characterData={characterData}
            />
          </div>
        }
      </div>
      {
        isValid &&
        <div className="tw-m-4">
          {`Время ношения духа ${timeInSpirit} минут`}
        </div>
      }
      {
        suitSpiritStatus !== '' && 
        <>
          <div className="tw-m-4 tw-p-4 tw-bg-blue-200 tw-font-semibold">
            {suitSpiritStatus}
          </div>
          <div className="tw-text-right tw-mb-8">
            <Button onClick={refreshCharacterModel}>Обновить данные персонажа</Button>
          </div>
        </>
      }
      <div className="tw-text-right">
        <Button disabled={!isValid || doSuitSpirit} onClick={() => setDoSuitSpirit(true)}>
          <FontAwesomeIcon
            className={classNames("tw-mr-2 ", {
              'tw-hidden': !doSuitSpirit,
            })}
            icon={faSpinner}
            spin
          />
          Надеть
        </Button>
      </div>
    </div>
  );
}

