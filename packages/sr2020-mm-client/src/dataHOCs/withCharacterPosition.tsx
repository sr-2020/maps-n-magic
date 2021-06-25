import React, { useState, useEffect } from 'react';
import { GameModel } from "sr2020-mm-event-engine";
import { ETrackedCharacterLocationChanged } from "sr2020-mm-client-event-engine";

const changeEventName = 'trackedCharacterLocationChanged';
const dataName = 'trackedCharacterLocationId';
const initState: ETrackedCharacterLocationChanged["trackedCharacterLocationId"] = null;

export interface WithCharacterPosition {
  trackedCharacterLocationId: number | null;
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
