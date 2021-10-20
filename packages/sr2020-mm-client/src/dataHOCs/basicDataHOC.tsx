import React, { useState, useEffect, ComponentType, Component } from 'react';
import * as R from 'ramda';
import { 
  GameModel, 
  // StrictGMEvent, 
  DefaultGMEvent,
  GMEvent,
  GMEvent2,
} from "sr2020-mm-event-engine";

export interface GameModelable {
  gameModel: GameModel;
}

// Try in future separate types from basicDataHOC function
// 
// interface BasicDataHOC<
//   T extends GMEvent2,
//   InitState,
//   DataName extends Omit<"type", keyof T> = Omit<"type", keyof T>,
// > {
//   changeEventName: T["type"];
//   dataName: DataName;
//   dataType: T[DataName];
//   hocDataType: T[DataName] | InitState,
//   WithHOC: {}
// }

export const basicDataHOC = function<
  InitState,
  T extends GMEvent = DefaultGMEvent,
  DataName extends keyof T = keyof T,
>(
  changeEventName: T["type"], 
  dataName: DataName, 
  initState: InitState,
  transformer: <M extends InitState | T[DataName]>(a: M) => M = R.identity
) {
  return (Wrapped: any) => (props: any) => {
    const { gameModel } = props;
    if (R.isNil(gameModel)) {
      throw new Error(`gameModel is nil for ${dataName} extraction. Did you pass game model for HOC component?`);
    }
    const [data, setData] = useState<InitState | T[DataName]>(initState);

    function update(event: T) {
      // console.log(changeEventName, event[dataName]);
      setData(transformer(event[dataName]));
    }

    useEffect(() => {
      gameModel.on(changeEventName, update);
      // console.log(changeEventName, transformer(gameModel.get(dataName)));
      setData(transformer(gameModel.get(dataName)));

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
