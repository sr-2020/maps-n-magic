import React, { useState, useEffect } from 'react';
import './SpiritPage.css';

import { 
  CharacterModelData2,
  ErrorResponse, 
  isEmptySpiritJar, 
  isErrorResponse, 
  isFullSpiritJar, 
  Spirit, 
  SpiritJarQr,
  validateEmptySpiritJarQr,
  validateFullSpiritJarQr,
  stringifyError
} from "sr2020-mm-event-engine";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';

import { QrScannerWrapper } from "../QrScannerWrapper";
import { getSpiritDataByQr, freeSpirit, catchSpirit, logClientError } from "../../api";
import { SpiritCard } from '../SpiritCard';
import { t, emptinessReason } from "../../utils";

// import { WithTranslation } from "react-i18next";

interface SpiritPageProps {
  setTitle: (title: string) => void;
  characterData: CharacterModelData2;
}

export function SpiritPage(props: SpiritPageProps) {
  const { setTitle, characterData } = props;

  useEffect(() => {
    setTitle(t('scanSpiritPageTitle'));
  }, []);

  const [spiritJarQrString, setSpiritJarQrString] = useState<string | null>(null);
  // my QR from app
  // const [spiritJarQrString, setSpiritJarQrString] = useState<string | null>('6d15BQC35thg51935');
  // spirit jar
  // const [spiritJarQrString, setSpiritJarQrString] = useState<string | null>('7437AQCgkdhg359');
  // invalid qr string
  // const [spiritJarQrString, setSpiritJarQrString] = useState<string | null>('7437AQCgk_dhg359');
  const [errorResponse, setErrorResponse] = useState<ErrorResponse | null>(null);
  const [spiritJarQr, setSpiritJarQr] = useState<{
    spiritJarQr: SpiritJarQr;
    spirit: Spirit | undefined;
  } | null>(null);

  const [messageBody, setMessageBody] = useState<string>('');

  useEffect(() => {
    if (spiritJarQrString === null) {
      return;
    }
    getSpiritDataByQr(spiritJarQrString).then(res => {
      if (isErrorResponse(res)) {
        setErrorResponse(res);
      } else {
        setSpiritJarQr(res);
      }
    }).catch(err => {
      console.error(stringifyError(err));
      logClientError(t('unexpectedSpiritViewError'), err);
      setErrorResponse({
        errorTitle: t('unexpectedSpiritViewError'),
        errorSubtitle: stringifyError(err)
      });
    });
  }, [spiritJarQrString]);

  if (spiritJarQrString === null) {
    return (
      <QrScannerWrapper
        onSuccess={setSpiritJarQrString}
        message={t('scanSpiritJar')}
      />
    );
  }

  function onFreeSpiritClick() {
    if (spiritJarQr === null) {
      return;
    }
    // messageBody
    freeSpirit(
      Number(spiritJarQr.spiritJarQr.workModel.modelId), 
      t('mageFreedSpirit'),
      messageBody
    ).then(res => {
      if (isErrorResponse(res)) {
        setErrorResponse(res);
      } else {
        setSpiritJarQr({
          spiritJarQr: res.qrModelData,
          spirit: undefined
        });
        // setSpiritJarQrString(null);
      }
    }).catch(err => {
      console.error(stringifyError(err));
      logClientError(t('unexpectedFreeSpiritError'), err);
      setErrorResponse({
        errorTitle: t('unexpectedFreeSpiritError'),
        errorSubtitle: stringifyError(err)
      });
    });
  }

  return (
    <div className="SpiritPage tw-p-4">
      {
        errorResponse !== null && (
          <Alert className="tw-m-4" variant="warning">
            <div className="tw-font-bold">{errorResponse.errorTitle}</div>
            <div>{errorResponse.errorSubtitle}</div>
          </Alert>
        )
      }
      {
        (spiritJarQr !== null && isFullSpiritJar(spiritJarQr.spiritJarQr)) && 
        <>
          {
            spiritJarQr.spirit !== undefined &&
            <SpiritCard 
              className="tw-m-4 tw-mb-8"
              spirit={spiritJarQr.spirit}
              characterData={characterData}
            />
          }
          <div className="tw-mb-8">
            <Button variant="outline-secondary" onClick={onFreeSpiritClick}>
              {t('freeSpirit')}
            </Button>
          </div>
          <div style={{marginBottom: '20rem'}}>
            <div className="tw-mb-2">
              {t('leaveMessage')}
            </div>
            <div>
              <Form.Control
                as="textarea" rows={3}
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
              />
            </div>
          </div>
        </>
      }
      {
        (spiritJarQr !== null && isEmptySpiritJar(spiritJarQr.spiritJarQr)) && 
        <>
          <div>
            <div>{t('spiritJarIsEmpty')}</div>
            <div>{emptinessReason(spiritJarQr.spiritJarQr.workModel.data.emptiness_reason)}</div>
          </div>
        </>
      }
      {
        (spiritJarQr !== null || errorResponse !== null) &&
        <Button 
          className="tw-fixed tw-bottom-0 tw-w-40"
          onClick={() => {
            setSpiritJarQr(null);
            setSpiritJarQrString(null);
            setErrorResponse(null);
          }}
        >
          {t('scanOtherSpiritJar')}
        </Button>
      }
    </div>
  );
}

