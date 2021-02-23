import React, { useState, useEffect } from 'react';
import * as R from 'ramda';
import { isClinicallyDead, isRelevant } from 'sr2020-mm-event-engine';
import { lifeStyleScore } from 'sr2020-mm-data/gameConstants';
import * as moment from 'moment-timezone';

import { CharacterHealthStates, RawCharacterHealthState, CharacterHealthState } from "../types";

const changeEventName = 'characterHealthStatesLoaded';
const srcDataName = 'characterHealthStates';
const dstDataName = 'characterHealthList';
const initState: CharacterHealthState[] = [];

const mergeKeyNEntry = (idName: string) => ([id, data2]) => ({ [idName]: Number(id), ...data2 });
const objToList = (objItem2ListItem) => R.pipe(R.toPairs, R.map(objItem2ListItem));

function getUserNameStr(user) {
  return user && user.name !== '' ? ` (${user.name})` : '';
}

// const labels = marker.options.clinicalDeathIds.map((id) => id + this.getUserNameStr(gameModel.get({
//   type: 'userRecord',
//   id: Number(id),
// })));

export const withCharacterHealthListForTable = (Wrapped) => (props) => {
  const { gameModel } = props;
  const [data, setData] = useState(initState);

  function update(event) {
    const newData: CharacterHealthStates = event[srcDataName];

    const fullList = objToList(mergeKeyNEntry('characterId'))(newData) as CharacterHealthState[];
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
      R.filter(isClinicallyDead),
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
