import React, { useState, useEffect } from 'react';
import * as R from 'ramda';
import { 
  isDead,
  isRelevant,
  CharacterHealthStates, 
  GameModel
} from 'sr2020-mm-event-engine';
import * as moment from 'moment-timezone';

import { charHealthIndexToList } from "./charHealthUtils";


const changeEventName = 'characterHealthStatesLoaded';
const srcDataName = 'characterHealthStates';
const dstDataName = 'characterIdHealthList';
const initState: number[] = [];

export interface WithCharacterIdHealthListForAudio {
  'characterIdHealthList': number[]
}
// const mergeKeyNEntry2 = ([id, data2]) => ({ 'characterId': Number(id), ...data2 });

// const objToList = (objItem2ListItem) => R.pipe(R.toPairs, R.map(objItem2ListItem));
// const mergeKeyNEntry = (idName) => ([id, data2]) => ({ [idName]: Number(id), ...data2 });

// function getUserNameStr(user) {
//   return user && user.name !== '' ? ` (${user.name})` : '';
// }

// const labels = marker.options.clinicalDeathIds.map((id) => id + this.getUserNameStr(gameModel.get({
//   type: 'userRecord',
//   id: Number(id),
// })));

export const withCharacterIdHealthListForAudio = (Wrapped: any) => (props: object & {gameModel: GameModel}) => {
  const { gameModel } = props;
  const [data, setData] = useState(initState);

  function update(event: {[srcDataName]: CharacterHealthStates}) {
    const newData = event[srcDataName];

    // const fullList = objToList(mergeKeyNEntry('characterId'))(newData) as CharacterHealthState[];
    const fullList = charHealthIndexToList(newData);
    // const fullList2 = fullList.map((item) => {
    //   const userName = item.characterId + getUserNameStr(gameModel.get({
    //     type: 'userRecord',
    //     id: Number(item.characterId),
    //   }));
    //   return {
    //     ...item,
    //     userName,
    //   };
    // });
    const timestamp = moment.utc().valueOf();
    const fullList3 = R.pipe(
      // R.filter(isClinicallyDead),
      R.filter(isDead),
      R.filter(isRelevant(timestamp)),
      // @ts-ignore
      R.pluck('characterId'),
      // R.sortBy(R.prop('timestamp')),
      // @ts-ignore
    )(fullList) as number[];

    setData(fullList3);
  }

  useEffect(() => {
    gameModel.on(changeEventName, update);
    update({
      [srcDataName]: gameModel.get(srcDataName),
    });

    return () => {
      gameModel.off(changeEventName, update);
    };
  }, [gameModel]);

  return <Wrapped {...props} {...{ [dstDataName]: data }} />;
};
