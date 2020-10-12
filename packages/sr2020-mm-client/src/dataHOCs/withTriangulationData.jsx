import React, { useState, useEffect } from 'react';

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
    const triangulationData = gameModel.get(dataName);

    const centroids = [...triangulationData.keys()].map((locationId) => ({
      locationId,
      centroidLatLng: triangulationData.get(locationId).centroid,
    }));
    // console.log('withTriangulationData', triangulationData);
    // console.log('centroids', centroids);

    const edges = [...triangulationData.keys()].reduce((acc, locationId1) => {
      triangulationData.get(locationId1).neighborsList.forEach((locationId2) => {
        if (locationId1 < locationId2) {
          acc.push({
            edgeId: `${locationId1}-${locationId2}`,
            centroidLatLng1: triangulationData.get(locationId1).centroid,
            centroidLatLng2: triangulationData.get(locationId2).centroid,
          });
        }
      });
      return acc;
    }, []);
    // console.log('edges', edges);

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
