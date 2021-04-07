import React, { useState, useEffect } from 'react';
import { GameModel } from "sr2020-mm-event-engine";

export const settingsDataHOC = function <T>(changeEventName: string, dataName: string, initState: T) {
  return (Wrapped: any) => (props: object & {gameModel: GameModel}) => {
    const { gameModel } = props;
    const [data, setData] = useState(initState);

    function update(event: any) {
      setData(event.settingsCatalog?.[dataName] || initState);
    }

    useEffect(() => {
      gameModel.on(changeEventName, update);
      update({ settingsCatalog: gameModel.get('settingsCatalog') });

      return () => {
        gameModel.off(changeEventName, update);
      };
    }, [gameModel]);

    return <Wrapped {...props} {...{ [dataName]: data }} />;
  };
};
