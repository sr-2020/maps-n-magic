import React, { useState, useEffect } from 'react';
// import { TranslatorConsumer } from './translatorContext';

export const withLocationRecords = (Wrapped) => (props) => {
  const { gameModel } = props;
  const [locationRecords, setLocationRecords] = useState([]);

  function updateLocations({ locationRecords: newLocationRecords }) {
    setLocationRecords(newLocationRecords);
  }

  useEffect(() => {
    gameModel.on('locationRecordsChanged2', updateLocations);
    updateLocations({
      locationRecords: gameModel.get('locationRecords'),
    });

    return () => {
      gameModel.off('locationRecordsChanged2', updateLocations);
    };
  }, [gameModel]);

  return <Wrapped {...props} locationRecords={locationRecords} />;
};
