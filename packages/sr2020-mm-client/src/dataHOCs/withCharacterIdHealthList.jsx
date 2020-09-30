import React, { useState, useEffect } from 'react';
import * as R from 'ramda';
import { isClinicallyDead } from 'sr2020-mm-event-engine/utils';

const changeEventName = 'characterHealthStatesLoaded';
const srcDataName = 'characterHealthStates';
const dstDataName = 'characterIdHealthList';
const initState = [];

const objToList = (objItem2ListItem) => R.pipe(R.toPairs, R.map(objItem2ListItem));
const mergeKeyNEntry = (idName) => ([id, data2]) => ({ [idName]: Number(id), ...data2 });

function getUserNameStr(user) {
  return user && user.name !== '' ? ` (${user.name})` : '';
}

// const labels = marker.options.clinicalDeathIds.map((id) => id + this.getUserNameStr(gameModel.get({
//   type: 'userRecord',
//   id: Number(id),
// })));

export const withCharacterIdHealthList = (Wrapped) => (props) => {
  const { gameModel } = props;
  const [data, setData] = useState(initState);

  function update(event) {
    const newData = event[srcDataName];

    const fullList = objToList(mergeKeyNEntry('characterId'))(newData);
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

    const fullList3 = R.pipe(
      R.filter(isClinicallyDead),
      R.pluck('characterId'),
      // R.sortBy(R.prop('timestamp')),
    )(fullList);

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
