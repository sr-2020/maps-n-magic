import React, { useState, useEffect } from 'react';

export interface WithModelRunData {
  isModelRunning: boolean;
  speed: number;
  onClick: (type: 'runModel' | 'stopModel', speed?: number) => () => void;
}

export const withModelRunData = (Wrapped: any) => (props: any) => {
  const { gameModel } = props;

  const [runState, setRunState] = useState({
    isModelRunning: false,
    speed: null,
  });

  function refresh() {
    setRunState({
      isModelRunning: gameModel.get('isModelRunning'),
      speed: gameModel.get('modelSpeed'),
    });
  }

  useEffect(refresh, [gameModel]);

  useEffect(() => {
    console.log('on subscribe ModelRunSelector');
    gameModel.on('modelRunningChange', refresh);
    return () => {
      console.log('off subscribe ModelRunSelector');
      gameModel.off('modelRunningChange', refresh);
    };
  }, []);

  function onClick(type: 'runModel' | 'stopModel', speed?: number): () => void {
    return () => {
      gameModel.execute({
        type,
        speed,
      });
    };
  }

  return (
    <Wrapped
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      onClick={onClick}
      isModelRunning={runState.isModelRunning}
      speed={runState.speed}
    />
  );
};

// export function ModelRunSelector (props) {
//   const { gameModel } = props;

//   const [runState, setRunState] = useState({
//     isModelRunning: false,
//     speed: null,
//   });

//   function refresh() {
//     setRunState({
//       isModelRunning: gameModel.get('isModelRunning'),
//       speed: gameModel.get('modelSpeed'),
//     });
//   }

//   useEffect(refresh, [gameModel]);

//   useEffect(() => {
//     console.log("on subscribe ModelRunSelector");
//     gameModel.on('modelRunningChange', refresh);
//     return () => {
//       console.log("off subscribe ModelRunSelector");
//       gameModel.off('modelRunningChange', refresh);
//     };
//   }, []);

//   function onClick(type, speed) {
//     return () => {
//       gameModel.execute({
//         type,
//         speed,
//       });
//     };
//   }

//   return  (
//     <ModelRunSelector2
//       onClick={onClick}
//       isModelRunning={runState.isModelRunning}
//       speed={runState.speed}
//     />
//   );
// }
