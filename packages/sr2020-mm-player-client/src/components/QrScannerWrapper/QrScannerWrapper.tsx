import React, { useState } from 'react';
import './QrScannerWrapper.css';

import QRScanner, { QRCode } from 'qrx-scanner';
import { ErrorBoundary } from "react-error-boundary";
import Button from "react-bootstrap/Button";
// import { WithTranslation } from "react-i18next";

interface QrScannerWrapperProps {
  onSuccess: ((qrData: string) => void);
  onFailed?: ((error: Error) => void);
  onCancel?: () => void;
  message?: string;
}

const facingMode = process.env.NODE_ENV === 'production' 
  ? 'environment' 
  : 'user';

const videoConstraints: MediaTrackConstraints  = {
  facingMode,
  height: 1080,
};

export function QrScannerWrapper(props: QrScannerWrapperProps) {
  const { onFailed, onSuccess, message, onCancel } = props;

  const defaultOnFailed = (error: Error) => {throw error};

  return (
    <div className="QrScannerWrapper tw-flex tw-flex-col">
      {
        message && 
        <div className="tw-absolute" style={{left: '50%'}}>
          <div className="tw-relative tw-py-2 tw-px-4 tw-bg-white tw-opacity-70" style={{left: '-50%'}}>
            {message}
          </div>
        </div>
      }
      <ErrorBoundary fallback={<>Ошибка при сканировании QR</>}>
        <QRScanner
          cursorResolution={600}
          timeout={10 * 60000} // 10 minutes
          onFailed={onFailed || defaultOnFailed}
          onSuccess={({ data }) => onSuccess(data)}
          videoSize="cover"
          webcamProps={{ 
            videoConstraints,
            className: 'tw-max-w-none'
          }}
          cursorClassName="qr-scanner_cursor-pos"
        />
      </ErrorBoundary>
      {
        onCancel && (
          <Button 
            className="tw-fixed tw-bottom-0 tw-w-40"
            onClick={onCancel}
          >
            Отмена
          </Button>
        )
      }
    </div>
  );
}



