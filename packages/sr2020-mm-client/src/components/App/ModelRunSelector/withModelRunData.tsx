import React, { useState, useEffect } from 'react';

export const withModelRunData = (Wrapped) => (props) => {
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

  function onClick(type, speed) {
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
