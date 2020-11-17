import React, { useState, useEffect } from 'react';

export const settingsDataHOC = function (changeEventName, dataName, initState) {
  return (Wrapped) => (props) => {
    const { gameModel } = props;
    const [data, setData] = useState(initState);

    function update(event) {
      setData(event.settings?.[dataName] || initState);
    }

    useEffect(() => {
      gameModel.on(changeEventName, update);
      update({ settings: gameModel.get('allSettings') });

      return () => {
        gameModel.off(changeEventName, update);
      };
    }, [gameModel]);

    return <Wrapped {...props} {...{ [dataName]: data }} />;
  };
};
