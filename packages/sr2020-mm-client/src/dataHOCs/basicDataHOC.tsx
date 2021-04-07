import React, { useState, useEffect, ComponentType, Component } from 'react';
import { GameModel } from "sr2020-mm-event-engine";

export interface GameModelable {
  gameModel: GameModel;
}

export const basicDataHOC = function<InitState>(
  changeEventName: string, 
  dataName: string, 
  initState: InitState
) {
  return (Wrapped: any) => (props: any) => {
    const { gameModel } = props;
    const [data, setData] = useState(initState);

    function update(event: any) {
      setData(event[dataName]);
    }

    useEffect(() => {
      gameModel.on(changeEventName, update);
      update({
        [dataName]: gameModel.get(dataName),
      });

      return () => {
        gameModel.off(changeEventName, update);
      };
    }, [gameModel]);

    return <Wrapped {...props} {...{ [dataName]: data }} />;
  };
};


// : Component<WrappedComponent & GameModelable, {}>

// export const basicDataHOC = function<InitState>(
//   changeEventName: string, 
//   dataName: string, 
//   initState: InitState
// ) {
//   return function <T extends GameModelable>(Wrapped: ComponentType<T>){
//     return function(props: T) {
//       const { gameModel } = props;
//       const [data, setData] = useState(initState);
  
//       function update(event: any) {
//         setData(event[dataName]);
//       }
  
//       useEffect(() => {
//         gameModel.on(changeEventName, update);
//         update({
//           [dataName]: gameModel.get(dataName),
//         });
  
//         return () => {
//           gameModel.off(changeEventName, update);
//         };
//       }, [gameModel]);
  
//       return <Wrapped {...props} {...{ [dataName]: data }} />;
//     };
//   } 
// };


// export const basicDataHOC = function<InitState>(changeEventName: string, dataName: string, initState: InitState) {
//   return function <T extends GameModelable>(Wrapped: ComponentType<T>){
//     return function(props: T) {
//       const { gameModel } = props;
//       const [data, setData] = useState(initState);
  
//       function update(event: any) {
//         setData(event[dataName]);
//       }
  
//       useEffect(() => {
//         gameModel.on(changeEventName, update);
//         update({
//           [dataName]: gameModel.get(dataName),
//         });
  
//         return () => {
//           gameModel.off(changeEventName, update);
//         };
//       }, [gameModel]);
  
//       return <Wrapped {...props} {...{ [dataName]: data }} />;
//     };
//   } 
// };


// export const basicDataHOC = function<T>(changeEventName: string, dataName: string, initState: T) {
//   return function<Component extends ComponentType<GameModelable>>(Wrapped: Component){
//     return function(props: object & {gameModel: GameModel}) {
//       const { gameModel } = props;
//       const [data, setData] = useState(initState);
  
//       function update(event: any) {
//         setData(event[dataName]);
//       }
  
//       useEffect(() => {
//         gameModel.on(changeEventName, update);
//         update({
//           [dataName]: gameModel.get(dataName),
//         });
  
//         return () => {
//           gameModel.off(changeEventName, update);
//         };
//       }, [gameModel]);
  
//       return <Wrapped {...props} {...{ [dataName]: data }} />;
//     };
//   } 
// };
