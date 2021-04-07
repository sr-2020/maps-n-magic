import React, { useState, useEffect } from 'react';
import { GameModel } from "sr2020-mm-event-engine";
import { ECharacterLocationChanged } from "sr2020-mm-client-event-engine";

const changeEventName = 'characterLocationChanged';
const dataName = 'characterLocationId';
const initState: ECharacterLocationChanged["characterLocationId"] = null;

export interface WithCharacterPosition {
  characterLocationId: number;
}

// export const withCharacterPosition = (Wrapped: any) => (props: object & {gameModel: GameModel}) => {
export const withCharacterPosition = (Wrapped: any) => (props: any) => {
  const { gameModel } = props;
  const [data, setData] = useState(initState);

  function update(event: any) {
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
