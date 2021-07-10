import React, { useState, useEffect } from 'react';
import * as R from 'ramda';
import { 
  isClinicallyDead,
  isDead,
  isRelevant,
  CharacterHealthStates, 
  CharacterHealthState,
  lifeStyleScore,
  GameModel
} from 'sr2020-mm-event-engine';
import * as moment from 'moment-timezone';

import { charHealthIndexToList } from "./charHealthUtils";

const changeEventName = 'characterHealthStatesLoaded';
const srcDataName = 'characterHealthStates';
const dstDataName = 'characterHealthList';
const initState: CharacterHealthState[] = [];

// const mergeKeyNEntry = (idName: string) => ([id, data2]) => ({ [idName]: Number(id), ...data2 });
// const objToList = (objItem2ListItem) => R.pipe(R.toPairs, R.map(objItem2ListItem));

// function getUserNameStr(user) {
//   return user && user.name !== '' ? ` (${user.name})` : '';
// }

export interface WithCharacterHealthListForTable {
  [dstDataName]: CharacterHealthState[]
}

// const labels = marker.options.clinicalDeathIds.map((id) => id + this.getUserNameStr(gameModel.get({
//   type: 'userRecord',
//   id: Number(id),
// })));

export const withCharacterHealthListForTable = (Wrapped: any) => (props: object & {gameModel: GameModel}) => {
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
    // const ageNameSort = ;
    // const _isRelevant = isRelevant as (timestamp: number) => (state: CharacterHealthState) => boolean;
    const timestamp = moment.utc().valueOf();
    const _isRelevant = isRelevant(timestamp);
    // type step = (states: CharacterHealthState[]) => CharacterHealthState[];
    // @ts-ignore
    const fullList3: CharacterHealthState[] = R.pipe(
      // R.filter(isClinicallyDead),
      R.filter(isDead),
      // @ts-ignore
      R.filter(_isRelevant),
      R.sortWith([
        // @ts-ignore
        R.descend((el) => lifeStyleScore[el.lifeStyle]),
        R.ascend(R.prop('timestamp')),
      ]),
      // R.sortBy((el) => -lifeStyleScore[el.lifeStyle]),
      // R.sortBy(R.prop('timestamp')),
    // @ts-ignore
    )(fullList);

    // console.log(R.filter(isClinicallyDead, fullList));

    setData(fullList3);
    // const locationIndex = R.groupBy(R.prop('locationId'), fullList2);

    // const updatedIndex = R.mapObjIndexed((characters, locationId) => {
    //   const location = gameModel.get({
    //     type: 'locationRecord',
    //     id: Number(locationId),
    //   });
    //   return {
    //     characters,
    //     location,
    //     locationId: Number(locationId),
    //   };
    // }, locationIndex);

    // // const objToList(mergeKeyNEntry('locationId'))(locationIndex);
    // const list = R.values(updatedIndex);
    // const filteredList = list.filter((el) => el.location);
    // if (list.length !== filteredList.length) {
    //   console.error('Some locations not found', list.filter((el) => !el.location));
    // }
    // setData(filteredList);
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
