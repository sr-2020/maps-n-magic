import React, { useRef, useState, useEffect } from 'react';
import './QrScannerWrapper.css';

import QRScanner, { QRCode } from 'qrx-scanner';
import { ErrorBoundary } from "react-error-boundary";
import Button from "react-bootstrap/Button";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { dictionary } from "../../utils";

interface QrScannerWrapperProps {
  onSuccess: ((qrData: string) => void);
  onFailed?: ((error: Error) => void);
  onCancel?: () => void;
  message?: string;
}

// type t = MediaStreamConstraints;

let defaultFacingMode = process.env.NODE_ENV === 'production' 
  ? 'environment' 
  : 'user';

// if (localStorage.getItem("invertCamera") !== undefined ) {
//   defaultFacingMode = process.env.NODE_ENV !== 'production' 
//   ? 'environment' 
//   : 'user';
// }

export function QrScannerWrapper(props: QrScannerWrapperProps) {
  const { onFailed, onSuccess, message, onCancel } = props;

  const [facingMode, setFacingMode] = useState<string>(defaultFacingMode);
  const [torch, setTorch] = useState<boolean>(false);

  const qrScanner = useRef<QRScanner>(null);
  
  const videoConstraints: MediaTrackConstraints  = {
    facingMode: facingMode,
    height: 1080,
  };
  const defaultOnFailed = (error: Error) => {throw error};

  useEffect(() => {
    // based on 
    // https://stackoverflow.com/questions/37848494/is-it-possible-to-control-the-camera-light-on-a-phone-via-a-website/47153547#47153547
    const stream = qrScanner.current?.webcam?.stream;

    if (stream) {
      const track = stream.getVideoTracks()[0];

      // const imageCapture = new ImageCapture(track);
      // const photoCapabilities = await 
      
      // imageCapture.getPhotoCapabilities().then((photoCapabilities) => {
      //   console.log('photoCapabilities', photoCapabilities);
      // });

      const data = track.getCapabilities();
      // console.log('data', data);
      
      // track.applyConstraints({
      //   // advanced: [{torch, brightness: torch ? 1 : 1}]
      //   // advanced: [{torch}]
      //   advanced: [{brightness: torch ? 100 : 100}]
      // });
      if (data.torch) {
        
        track.applyConstraints({
          // advanced: [{torch, brightness: torch ? 0 : 1}]
          advanced: [{torch}]
          // advanced: [{brightness: torch ? 0 : 255}]
        });
      }

    }
  }, [qrScanner, torch]);

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
      <ErrorBoundary fallback={<>{dictionary.qrScanError}</>}>
        <QRScanner
          ref={qrScanner}
          // cursorResolution={600}
          minCursorSize={0.7}
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
            {dictionary.cancel}
          </Button>
        )
      }
      {/* <Button 
        className="tw-absolute tw-right-0 tw-bg-green-900 tw-border-green-900 tw-opacity-70"
        style={{top: '6rem'}}
        onClick={() => setFacingMode(facingMode === 'user' ? 'environment' : 'user')}
        title={dictionary.changeCamera}
      >
        <FontAwesomeIcon
          icon={faSync}
        />
      </Button> */}
      <Button 
        className="tw-absolute tw-right-0 tw-bg-green-900 tw-border-green-900 tw-opacity-70"
        style={{top: '6rem'}}
        onClick={() => setTorch(!torch)}
        title={dictionary.onOffTorch}
      >
        <FontAwesomeIcon
          // icon={torch ? faLightbulb : faSync}
          icon={faLightbulb}
        />
      </Button>
    </div>
  );
}



