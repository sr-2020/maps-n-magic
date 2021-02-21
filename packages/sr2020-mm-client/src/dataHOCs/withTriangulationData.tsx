import React, { useState, useEffect } from 'react';
import * as R from 'ramda';

import { edgeIdToPair } from 'sr2020-mm-event-engine/utils';

import { 
  TriangulationData
} from "../types";

const changeEventName = 'locationRecordsChanged2';
const dataName = 'triangulationData';
const initState = {
  centroids: [],
  edges: [],
};

export const withTriangulationData = (Wrapped) => (props) => {
  const { gameModel } = props;
  const [data, setData] = useState(initState);

  function update(event) {
    const triangulationData: TriangulationData = gameModel.get(dataName);

    // const centroids = [...triangulationData.keys()].map((locationId) => ({
    //   locationId,
    //   centroidLatLng: triangulationData.get(locationId).centroid,
    // }));
    // console.log('withTriangulationData', triangulationData);
    // console.log('centroids', centroids);

    const { neighborsIndex, centroids, edgeSet } = triangulationData;
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
