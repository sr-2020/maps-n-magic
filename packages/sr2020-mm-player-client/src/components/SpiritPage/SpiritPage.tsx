import React, { useState, useEffect } from 'react';
import './SpiritPage.css';

import { ErrorResponse, isErrorResponse, SpiritJarQr } from "sr2020-mm-event-engine";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

import { QrScannerWrapper } from "../QrScannerWrapper";
import { getSpiritDataByQr, freeSpirit, catchSpirit } from "../../api";

// import { WithTranslation } from "react-i18next";

interface SpiritPageProps {
}

export function SpiritPage(props: SpiritPageProps) {
  // const { t } = props;
  // const [spiritJarQrString, setSpiritJarQrString] = useState<string | null>(null);
  // my QR from app
  // const [spiritJarQrString, setSpiritJarQrString] = useState<string | null>('6d15BQC35thg51935');
  // spirit jar
  const [spiritJarQrString, setSpiritJarQrString] = useState<string | null>('7437AQCgkdhg359');
  // invalid qr string
  // const [spiritJarQrString, setSpiritJarQrString] = useState<string | null>('7437AQCgk_dhg359');
  const [errorResponse, setErrorResponse] = useState<ErrorResponse | null>(null);
  const [spiritJarQr, setSpiritJarQr] = useState<SpiritJarQr | null>(null);

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
      console.error(err);
      setErrorResponse({
        errorTitle: 'Непредвиденная ошибка',
        errorSubtitle: err
      });
    });
  }, [spiritJarQrString]);

  if (spiritJarQrString === null) {
    return (
      <QrScannerWrapper
        onSuccess={setSpiritJarQrString}
      />
    );
  }

  function onFreeSpiritClick() {
    if (spiritJarQr === null) {
      return;
    }
    freeSpirit(Number(spiritJarQr.workModel.modelId), 'Маг освободил духа').then(res => {
    // freeSpirit(Number(123456789), 'Маг освободил духа').then(res => {
      if (isErrorResponse(res)) {
        setErrorResponse(res);
      } else {
        setSpiritJarQr(res);
        // setSpiritJarQrString(null);
      }
    }).catch(err => {
      console.error(err);
      setErrorResponse({
        errorTitle: 'Непредвиденная ошибка',
        errorSubtitle: err
      });
    });
  }

  function onCatchSpiritClick() {
    if (spiritJarQr === null) {
      return;
    }
    catchSpirit(Number(spiritJarQr.workModel.modelId), 3434).then(res => {
      if (isErrorResponse(res)) {
        setErrorResponse(res);
      } else {
        setSpiritJarQr(res);
        // setSpiritJarQr(null);
        // setSpiritJarQrString(null);
      }
    }).catch(err => {
      console.error(err);
      setErrorResponse({
        errorTitle: 'Непредвиденная ошибка',
        errorSubtitle: err
      });
    });
  }

  return (
    <div className="SpiritPage">
      SpiritPage content
      <br/>
      {spiritJarQrString}
      {
        JSON.stringify(spiritJarQr)
      }
      {
        errorResponse !== null && (
          <Alert className="tw-m-4" variant="warning">
            <div className="tw-font-bold">{errorResponse.errorTitle}</div>
            <div>{errorResponse.errorSubtitle}</div>
          </Alert>
        )
      }
      {
        ('spiritId' in (spiritJarQr?.workModel.data || {})) && 
        <Button variant="outline-secondary" onClick={onFreeSpiritClick}>
          Освободить духа
        </Button>
      }
      {
        ('emptiness_reason' in (spiritJarQr?.workModel.data || {})) && 
        <Button variant="primary" onClick={onCatchSpiritClick}>
          Поймать духа
        </Button>
      }
    </div>
  );
}



