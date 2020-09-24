import React, { useState, useEffect } from 'react';

export const withBeaconRecords = (Wrapped) => (props) => {
  const { gameModel } = props;
  const [beaconRecords, setBeaconRecords] = useState([]);

  function updateBeacons({ beaconRecords: newBeaconRecords }) {
    setBeaconRecords(newBeaconRecords);
  }

  useEffect(() => {
    gameModel.on('beaconRecordsChanged2', updateBeacons);
    updateBeacons({
      beaconRecords: gameModel.get('beaconRecords'),
    });

    return () => {
      gameModel.off('beaconRecordsChanged2', updateBeacons);
    };
  }, [gameModel]);

  return <Wrapped {...props} beaconRecords={beaconRecords} />;
};
