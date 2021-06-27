import React, { useState, useEffect } from 'react';
import './SpiritPage.css';

import { ErrorResponse, isErrorResponse } from "sr2020-mm-event-engine";
import Alert from "react-bootstrap/Alert";

import { QrScannerWrapper } from "../QrScannerWrapper";
import { getSpiritDataByQr } from "../../api";

// import { WithTranslation } from "react-i18next";

interface SpiritPageProps {
}

export function SpiritPage(props: SpiritPageProps) {
  // const { t } = props;
  // const [spiritJarQrString, setSpiritJarQrString] = useState<string | null>(null);
  // my QR from app
  const [spiritJarQrString, setSpiritJarQrString] = useState<string | null>('6d15BQC35thg51935');
  // spirit jar
  // const [spiritJarQrString, setSpiritJarQrString] = useState<string | null>('7437AQCgkdhg359');
  // invalid qr string
  // const [spiritJarQrString, setSpiritJarQrString] = useState<string | null>('7437AQCgk_dhg359');
  const [errorResponse, setErrorResponse] = useState<ErrorResponse | null>(null);

  useEffect(() => {
    if (spiritJarQrString === null) {
      return;
    }
    getSpiritDataByQr(spiritJarQrString).then(res => {
      if (isErrorResponse(res)) {
        setErrorResponse(res);
      }
    });
  }, [spiritJarQrString]);

  if (spiritJarQrString === null) {
    return (
      <QrScannerWrapper
        onSuccess={setSpiritJarQrString}
      />
    );
  }

  return (
    <div className="SpiritPage">
      SpiritPage content
      <br/>
      {spiritJarQrString}
      {
        errorResponse !== null && (
          <Alert className="tw-m-4" variant="warning">
            <div className="tw-font-bold">{errorResponse.errorTitle}</div>
            <div>{errorResponse.errorSubtitle}</div>
          </Alert>
        )
      }
    </div>
  );
}



