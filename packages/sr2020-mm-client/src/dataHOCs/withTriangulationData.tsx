import React, { 
  useState, 
  useEffect, 
  Component, 
  ComponentType, 
  FunctionComponent,
  PropsWithChildren,
  ReactElement,
  ComponentProps
} from 'react';
import * as R from 'ramda';
import { L } from "sr2020-mm-client-core";

import { 
  edgeIdToPair, 
  TriangulationCentroid,
  TriangulationData,
  SRLatLng,
  GameModel
} from 'sr2020-mm-event-engine';
import { ELocationRecordsChanged2 } from 'sr2020-mm-event-engine';

export interface TriangulationEdge {
  edgeId: string;
  centroidLatLng1: L.LatLngLiteral;
  centroidLatLng2: L.LatLngLiteral;
}

export interface WithTriangulationData {
  centroids: TriangulationCentroid[];
  edges: TriangulationEdge[]
}

const changeEventName = 'locationRecordsChanged2';
const dataName = 'triangulationData';
const initState: WithTriangulationData = {
  centroids: [],
  edges: [],
};

export interface GameModelable {
  gameModel: GameModel;
}

export const withTriangulationData = (Wrapped: any) => (props: any) => {
  const { gameModel } = props;
  const [data, setData] = useState(initState);

  function update(event: any) {
    const triangulationData: TriangulationData = gameModel.get(dataName);

    // const centroids = [...triangulationData.keys()].map((locationId) => ({
    //   locationId,
    //   centroidLatLng: triangulationData.get(locationId).centroid,
    // }));
    // console.log('withTriangulationData', triangulationData);
    // console.log('centroids', centroids);

    const { centroids, edgeSet } = triangulationData;
    const centroidIndex = R.indexBy((el) => `${el.locationId}`, centroids);
    
    const edges = Array.from(edgeSet).map((edgeId) => {
      const [locationId1, locationId2] = edgeIdToPair(edgeId);
      return {
        edgeId,
        centroidLatLng1: centroidIndex[Number(locationId1)].centroidLatLng,
        centroidLatLng2: centroidIndex[Number(locationId2)].centroidLatLng,
      };
    });

    setData({
      centroids,
      edges,
    });
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

  return <Wrapped {...props} edges={data.edges} centroids={data.centroids} />;
};


// // before
// // type comp1 = Component<Props extends GameModelable>;
// // after
// // type comp2 = Component<(Props extends GameModelable) & WithTriangulationData>;

// // 1. get initial state
// // 2. listen events on state change

// // return function <T extends GameModelable>(Wrapped: ComponentType<T>){
// //   return function(props: T) {

// // parent => <Component gameModel={gameModel}/>
// // HOC (gameModel, edges, centroids) transforms to (gameModel)
// // leaf component: gameModel, edges, centroids


// // <
// //   C extends React.ComponentType<React.ComponentProps<C> & WithTranslationProps>,
// //   ResolvedProps = JSX.LibraryManagedAttributes<
// //     C,
// //     Subtract<React.ComponentProps<C>, WithTranslationProps>
// //   >
// // >(
// //   component: C,
// // ) => React.ComponentType<Omit<ResolvedProps, keyof WithTranslation<N>> & WithTranslationProps>;

// // examples are based on react-i18n withTranslation
// // case 1 - pass all props, do nothing else
// type case1 = <
//   // we expect React component
//   C extends React.ComponentType<
//     // with some props
//     React.ComponentProps<C>
//   >,
//   ResolvedProps = JSX.LibraryManagedAttributes<
//     C,
//     React.ComponentProps<C>
//   >
// >(component: C) => React.ComponentType<ResolvedProps>;

// // or if you not care about specific cases
// type case1p1 = <C extends React.ComponentType<React.ComponentProps<C>>>
//   (component: C) => React.ComponentType<React.ComponentProps<C>>;

// // notes 
// type case1p2 = 
//   // wrapped component typing
//   <C extends React.ComponentType<React.ComponentProps<C>>>
//   (component: C) => 
//   // HOCed component typing
//   React.ComponentType<React.ComponentProps<C>>;

// // case 2 - gameModel required by HOC, and pass it to wrapped component
// type case2 = 
//   // wrapped component typing
//   <C extends React.ComponentType<React.ComponentProps<C>>>
//   (component: C) => 
//   // HOCed component typing
//   React.ComponentType<React.ComponentProps<C> & GameModelable>;

// // case 3 - wrapped component may use extra HOC props
// type case3 = 
//   // wrapped component typing
//   <C extends React.ComponentType<React.ComponentProps<C> & Partial<WithTriangulationData>>>
//   (component: C) => 
//   // HOCed component typing
//   React.ComponentType<React.ComponentProps<C>>;

// // case 4 = case 2 + case 3
// type case4 = 
//   // wrapped component typing
//   <C extends React.ComponentType<React.ComponentProps<C> & Partial<WithTriangulationData>>>
//   (component: C) => 
//   // HOCed component typing
//   React.ComponentType<React.ComponentProps<C> & GameModelable>;

// // type Subtract<T extends K, K> = Omit<T, keyof K>;

// // type t = <
// //   // we expect React component
// //   C extends React.ComponentType<
// //     GameModelable & // which requires gameModel
// //     GameModelable & // which requires gameModel
// //     React.ComponentProps<C> & 
// //     Partial<WithTriangulationData>>,
// //   ResolvedProps = JSX.LibraryManagedAttributes<
// //     C,
// //     Subtract<React.ComponentProps<C>, WithTranslationProps>
// //   >
// // >(
// //   component: C,
// // ) => React.ComponentType<Omit<ResolvedProps, keyof WithTranslation<N>> & WithTranslationProps>;

// // type t = <
// //   C extends React.ComponentType<React.ComponentProps<C> & GameModelable>,
// //   ResolvedProps = JSX.LibraryManagedAttributes<
// //     C,
// //     Subtract<React.ComponentProps<C>, GameModelable>
// //   >
// // >(
// //   component: C,
// // ) => React.ComponentType<ResolvedProps & GameModelable>;

// // export const withTriangulationData = (Wrapped: any) => (props: object & {gameModel: GameModel}) => {
// // export function withTriangulationData<T extends GameModelable>(Wrapped: ComponentType<T>) {
//   // export function withTriangulationData<P extends GameModelable, T extends ComponentType<P & WithTriangulationData>>(Wrapped: T)
//   // : FunctionComponent<P> 


//   // type case4 = 
//   // // wrapped component typing
//   // <C extends React.ComponentType<React.ComponentProps<C> & Partial<WithTriangulationData>>>
//   // (component: C) => 
//   // // HOCed component typing
//   // React.ComponentType<React.ComponentProps<C> & GameModelable>;


// export function withTriangulationData<
//   C extends ComponentType<WrappedProps>,
//   // ComponentProps<C> extends GameModelable,
//   WrappedProps = ComponentProps<C> & Partial<WithTriangulationData>,
//   HOCProps = ComponentProps<C> & GameModelable
// >
//   (Wrapped: C): ComponentType<HOCProps>
// {
//   // return function (props: PropsWithChildren<HOCProps>): ReactElement<WrappedProps, C> | null {
//   return function (props: HOCProps): ReactElement<WrappedProps, C> | null {
//     // T.props
//     const { gameModel } = props;

//     // (props as WrappedProps).edges
//     const [data, setData] = useState(initState);
  
//     // useCallback? or move function upper
//     function update(event: any) {
//       const triangulationData = gameModel.get<TriangulationData>(dataName);
  
//       // const centroids = [...triangulationData.keys()].map((locationId) => ({
//       //   locationId,
//       //   centroidLatLng: triangulationData.get(locationId).centroid,
//       // }));
//       // console.log('withTriangulationData', triangulationData);
//       // console.log('centroids', centroids);
  
//       const { centroids, edgeSet } = triangulationData;
//       const centroidIndex = R.indexBy((el) => `${el.locationId}`, centroids);
      
//       const edges = Array.from(edgeSet).map((edgeId) => {
//         const [locationId1, locationId2] = edgeIdToPair(edgeId);
//         return {
//           edgeId,
//           centroidLatLng1: centroidIndex[Number(locationId1)].centroidLatLng,
//           centroidLatLng2: centroidIndex[Number(locationId2)].centroidLatLng,
//         };
//       });
  
//       setData({
//         centroids,
//         edges,
//       });
//     }
  
//     useEffect(() => {
//       gameModel.on(changeEventName, update);
//       update({
//         [dataName]: gameModel.get(dataName),
//       });
  
//       return () => {
//         gameModel.off(changeEventName, update);
//       };
//     }, [gameModel]);
  
//     return <Wrapped {...props} edges={data.edges} centroids={data.centroids} />;
//   };

// } 
