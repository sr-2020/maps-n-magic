import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { ErrorResponse, isErrorResponse } from 'sr2020-mm-event-engine';
import { catchSpirit, catchSpirit2 } from '../../api';
import { ErrorAlert } from '../ErrorAlert';
import { QrScannerWrapper } from '../QrScannerWrapper';
import './CatchSpiritPage.css';

// import { WithTranslation } from "react-i18next";

interface CatchSpiritPageProps {
  id: number;
}

export function CatchSpiritPage(props: CatchSpiritPageProps) {
  const { id } = props;

  // const [spiritJarQrString, setSpiritJarQrString] = useState<string | null>('7437AQCgkdhg359');
  const [spiritJarQrString, setSpiritJarQrString] = useState<string | null>(null);
  // invalid qr string
  // const [spiritJarQrString, setSpiritJarQrString] = useState<string | null>('7437AQCgk_dhg359');
  const [errorResponse, setErrorResponse] = useState<ErrorResponse | null>(null);
  const [catchResult, setCatchResult] = useState<unknown | null>(null);
  const history = useHistory();

  useEffect(() => {
    if (spiritJarQrString === null) {
      return;
    }
    catchSpirit2(spiritJarQrString, id).then(res => {
      if (isErrorResponse(res)) {
        setErrorResponse(res);
      } else {
        setCatchResult(res);
      }
    }).catch(err => {
      console.error(err);
      setErrorResponse({
        errorTitle: 'Непредвиденная ошибка',
        errorSubtitle: JSON.stringify(err)
      });

      // Error: Objects are not valid as a React child (found: SyntaxError: Unexpected token R in JSON at position 0). If you meant to render a collection of children, use an array instead.
    });
  }, [spiritJarQrString]);

  if (spiritJarQrString === null) {
    return (
      <QrScannerWrapper
        onSuccess={setSpiritJarQrString}
        message="Отсканируйте пустой тотем"
        onCancel={() => history.goBack()}
      />
    );
  }

  return (
    <div className="CatchSpiritPage">
      {id}
      {JSON.stringify(catchResult)}
      {
        errorResponse !== null && (
          <ErrorAlert errorResponse={errorResponse} />
        )
      }
    </div>
  );
}



