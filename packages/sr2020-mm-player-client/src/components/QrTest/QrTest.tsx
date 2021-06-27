import React, { useState, RefObject, useRef, useEffect } from 'react';
import './QrTest.css';

import QRScanner, { IQRScannerProps } from 'qrx-scanner';

// import { WithTranslation } from "react-i18next";

interface QrTestProps {
}

const videoConstraints = {
  facingMode: 'user',
  height: 1080,
};

export function QrTest(props: QrTestProps) {
  // const { t } = props;

  const [res, setRes] = useState<string | null>(null);

  if (res !== null) {
    return <div>{res}</div>;
  }

  return (
    <div className="QrTest tw-flex tw-flex-col">
      <QRScanner
          // callback={showPreview}
          // className={className}
          className="custom-qr-scanner"
          timeout={10 * 60000} // 10 minutes
          // cursorClassName={cursorClassName}
          // cursorResolution={cursorResolution || 400}
          // fullScreen={fullScreen}
          // minCursorSize={cursorSize}
          onFailed={(error) => setRes(error.toString())}
          onSuccess={({ data }) => setRes(data)}
          // ref={scannerRef}
          // videoSize={videoSize}
          videoSize="cover"
          webcamProps={{ 
            videoConstraints,
            className: 'tw-max-w-none'
          }}
      />
    </div>
  );
}



// const usePreview = (): [
//   RefObject<HTMLImageElement>,
//   (imgData: ImageData) => void
// ] => {
//   const ref = useRef<HTMLImageElement>(null);

//   const canvas = document.createElement('canvas');
//   const ctx = canvas.getContext('2d');

//   return [
//       ref,
//       (imgData: ImageData) => {
//           canvas.width = imgData.width;
//           canvas.height = imgData.height;
//           ctx!.putImageData(imgData, 0, 0);
//           ref.current && (ref.current.src = canvas.toDataURL());
//       },
//   ];
// };

// export const QrTest2 = (): JSX.Element => {
//   const [facingMode, setFacingMode] = useState(
//     '"user"'
//       // isBrowser ? '"user"' : '{"exact": "environment"}'
//   );

//   const [fullScreen, setFullScreen] = useState(true);
//   const [videoSize, setVideoSize] = useState(
//       'contain' as IQRScannerProps['videoSize']
//   );
//   const [cursorSizeInput, setCursorSizeInput] = useState('30');
//   const [cursorResolution, setCursorResolution] = useState(400);
//   const [customCursor, setCustomCursor] = useState(false);
//   const [custom, setCustom] = useState(false);

//   const [res, setRes] = useState('' as any);

//   const cursorSize = +cursorSizeInput / 100;
//   const cursorClassName = customCursor ? 'custom-cursor' : '';
//   const className = custom ? 'custom' : '';

//   const [previewRef, showPreview] = usePreview();
//   const scannerRef = useRef<QRScanner>(null);

//   useEffect(() => {
//       scannerRef.current?.loaded && scannerRef.current?.handleResize();
//   });

//   const onRefresh = () => {
//       setRes('');
//       scannerRef.current!.scan();
//   };

//   const videoConstraints = {
//       facingMode: JSON.parse(facingMode),
//       height: 1080,
//   };

//   const info = (
//       <>
//           <div className="info">
//               <label htmlFor="facingMode">facingMode</label>
//               <select
//                   id="facingMode"
//                   onChange={({ target: { value } }) => setFacingMode(value)}
//                   value={facingMode}
//               >
//                   <option value='"user"'>{'user'}</option>
//                   <option value='{"exact": "environment"}'>
//                       {'{"exact": "environment"}'}
//                   </option>
//               </select>
//               <label htmlFor="fullScreen">fullScreen</label>
//               <input
//                   type="checkbox"
//                   id="fullScreen"
//                   checked={fullScreen}
//                   onChange={({ target: { checked } }) =>
//                       setFullScreen(checked)
//                   }
//               />
//               <label htmlFor="videoSize">videoSize</label>
//               <select
//                   id="videoSize"
//                   onChange={({ target: { value } }) =>
//                       setVideoSize(value as IQRScannerProps['videoSize'])
//                   }
//               >
//                   <option>contain</option>
//                   <option>cover</option>
//               </select>
//               <label htmlFor="minCursorSize">
//                   minCursorSize({cursorSize.toFixed(2)})
//               </label>
//               <input
//                   type="range"
//                   min="0"
//                   max="100"
//                   value={cursorSizeInput}
//                   id="minCursorSize"
//                   onChange={({ target: { value } }) =>
//                       setCursorSizeInput(value)
//                   }
//               />
//               <label htmlFor="cursorResolution">cursorResolution</label>
//               <input
//                   type="number"
//                   min="1"
//                   value={cursorResolution}
//                   id="cursorResolution"
//                   onChange={({ target: { value } }) =>
//                       setCursorResolution(Number(value))
//                   }
//               />
//               <label htmlFor="cursorClassName">cursorClassName</label>
//               <input
//                   type="checkbox"
//                   id="cursorClassName"
//                   checked={customCursor}
//                   onChange={({ target: { checked } }) =>
//                       setCustomCursor(checked)
//                   }
//               />
//               <label htmlFor="className">className</label>
//               <input
//                   type="checkbox"
//                   id="className"
//                   checked={custom}
//                   onChange={({ target: { checked } }) => setCustom(checked)}
//               />
//               <img ref={previewRef} id="preview" />
//           </div>
//       </>
//   );

//   return (
//     <div className="QrTest tw-flex tw-flex-col">
//       <QRScanner
//           // callback={showPreview}
//           // className={className}
//           className="custom-qr-scanner"
//           // cursorClassName={cursorClassName}
//           // cursorResolution={cursorResolution || 400}
//           // fullScreen={fullScreen}
//           // minCursorSize={cursorSize}
//           onFailed={(error) => setRes(error.toString())}
//           onSuccess={({ data }) => setRes(data)}
//           // ref={scannerRef}
//           // videoSize={videoSize}
//           videoSize="cover"
//           webcamProps={{ videoConstraints }}
//       >
//           {/* {info} */}
//           {res && (
//               <div className="tw-bg-white" id="res" onClick={onRefresh}>
//                   <div>{res.toString()}</div>
//                   🔄
//               </div>
//           )}
//       </QRScanner>
//     </div>

//   );
// };


