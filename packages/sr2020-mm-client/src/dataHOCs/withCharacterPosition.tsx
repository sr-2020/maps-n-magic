import React, { useState, useEffect } from 'react';

const changeEventName = 'characterLocationChanged';
const dataName = 'characterLocationId';
const initState = null;

export const withCharacterPosition = (Wrapped) => (props) => {
  const { gameModel } = props;
  const [data, setData] = useState(initState);

  function update(event) {
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
