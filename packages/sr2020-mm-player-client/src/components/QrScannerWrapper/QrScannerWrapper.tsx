import React, { useState } from 'react';
import './QrScannerWrapper.css';

import QRScanner, { QRCode } from 'qrx-scanner';
import { ErrorBoundary } from "react-error-boundary";
// import { WithTranslation } from "react-i18next";

interface QrScannerWrapperProps {
  onSuccess: ((qrData: string) => void);
  onFailed?: ((error: Error) => void);
}

const videoConstraints = {
  facingMode: 'user',
  height: 1080,
};

export function QrScannerWrapper(props: QrScannerWrapperProps) {
  const { onFailed, onSuccess } = props;

  const defaultOnFailed = (error: Error) => {throw error};

  return (
    <div className="QrScannerWrapper tw-flex tw-flex-col">
      <ErrorBoundary fallback={<>Ошибка при сканировании QR</>}>
        <QRScanner
            timeout={10 * 60000} // 10 minutes
            onFailed={onFailed || defaultOnFailed}
            onSuccess={({ data }) => onSuccess(data)}
            videoSize="cover"
            webcamProps={{ 
              videoConstraints,
              className: 'tw-max-w-none'
            }}
        />
      </ErrorBoundary>
    </div>
  );
}



