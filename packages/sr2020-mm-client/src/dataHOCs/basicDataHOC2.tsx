import React, { useState, useEffect, ComponentType, Component } from 'react';
import { GameModel, GMEvent, Typed, Req, Res } from "sr2020-mm-event-engine";

export interface GameModelable {
  gameModel: GameModel;
}

type t = (type: string | {type: string}) => any;
type arg = Req<t>;
type arg2 = Exclude<Req<t>, {type: string}>;

type DisallowedProps = { [k in keyof 'type']?: void };

type DataPart<StateType> = {[key: string]: StateType} & DisallowedProps;

type MyEvent<EventName extends string, StateType> = {
  type: EventName,
} & DataPart<StateType>;

// type MyEvent<EventName extends string, PropName extends string, StateType> = {
//   type: EventName,
//   [key: string]: StateType
// }

export const basicDataHOC2 = function<
  // EventType extends string,
  // GetterType extends string,
  StateType,
  RequestHandler extends (type: string) => StateType,
  EventName extends string,
  // Event = {type: '23', [Req<RequestHandler>]: StateType}
  // Event extends {type: string} & { [key: string]: StateType},
  // Event extends {type: string} & { [key: Exclude<string, 'type'>]: StateType},
  // DataName = Exclude<Req<RequestHandler>, {type: string}>
  // DataName = Req<RequestHandler> extends string ? (Req<RequestHandler> & string) : never
//   RequestHandler extends <GetName extends string>(type: GetName) => StateType,
//   EventName extends string,
//   // Event extends GMEvent, 
// // DataName extends string, 
//   // DataName extends keyof Event & string, 
//   DataName = Req<RequestHandler> & string,
//   StateType = Res<RequestHandler>,
//   Event = {type: EventName, [DataName]: StateType}
  // StateType = Event[DataName],
  // StateType = Event[DataName]
  // InitState = Event[DataName], 
  // Event[DataName] extends InitState
>(
  changeEventName: EventName, 
  dataName: Req<RequestHandler>, 
  // dataName: DataName, 
  // initState: Event[DataName]
) {
  return (Wrapped: any) => (props: any) => {
    // const { gameModel } = props;
    const gameModel: GameModel = props.gameModel;
    const [data, setData] = useState<StateType | undefined>(undefined);
    
    useEffect(() => {
      // function update(event: Event) {
      function update(event: MyEvent<EventName, StateType>) {
        setData(event[dataName]);
      }
      // gameModel.on2<Event>(changeEventName, update);
      gameModel.on2<MyEvent<EventName, StateType>>(changeEventName, update);
      setData(gameModel.get2<RequestHandler, StateType>(dataName));
      // update({
      //   [dataName]: gameModel.get(dataName),
      // });

      return () => {
        console.log('basicDataHOC before removing', gameModel.listenerCount(changeEventName));
        gameModel.off(changeEventName, update);
        console.log('basicDataHOC after removing', gameModel.listenerCount(changeEventName));
      };
    }, [gameModel]);

    if (data === undefined) {
      return null;
    }

    return <Wrapped {...props} {...{ [dataName]: data }} />;
  };
};



// export const basicDataHOC = function<
//   Event extends GMEvent, 
//   DataName extends keyof Event & string, 
//   // InitState = Event[DataName], 
//   // Event[DataName] extends InitState
// >(
//   changeEventName: Event["type"], 
//   dataName: DataName, 
//   initState: Event[DataName]
// ) {
//   return (Wrapped: any) => (props: any) => {
//     // const { gameModel } = props;
//     const gameModel: GameModel = props.gameModel;
//     const [data, setData] = useState(initState);

    
//     useEffect(() => {
//       function update(event: Event) {
//         setData(event[dataName]);
//       }
//       gameModel.on2<Event>(changeEventName, update);
//       setData(gameModel.get(dataName));
//       // update({
//       //   [dataName]: gameModel.get(dataName),
//       // });

//       return () => {
//         console.log('basicDataHOC before removing', gameModel.listenerCount(changeEventName));
//         gameModel.off(changeEventName, update);
//         console.log('basicDataHOC after removing', gameModel.listenerCount(changeEventName));
//       };
//     }, [gameModel]);

//     return <Wrapped {...props} {...{ [dataName]: data }} />;
//   };
// };


// export const basicDataHOC = function<InitState>(
//   changeEventName: string, 
//   dataName: string, 
//   initState: InitState
// ) {
//   return (Wrapped: any) => (props: any) => {
//     // const { gameModel } = props;
//     const gameModel: GameModel = props.gameModel;
//     const [data, setData] = useState(initState);

    
//     useEffect(() => {
//       function update(event: any) {
//         setData(event[dataName]);
//       }
//       gameModel.on2(changeEventName, update);
//       setData(gameModel.get(dataName));
//       // update({
//       //   [dataName]: gameModel.get(dataName),
//       // });

//       return () => {
//         console.log('basicDataHOC before removing', gameModel.listenerCount(changeEventName));
//         gameModel.off(changeEventName, update);
//         console.log('basicDataHOC after removing', gameModel.listenerCount(changeEventName));
//       };
//     }, [gameModel]);

//     return <Wrapped {...props} {...{ [dataName]: data }} />;
//   };
// };


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
