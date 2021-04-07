import React, { useState, useEffect } from 'react';
import * as R from 'ramda';
import { 
  isRelevant,
  LocationRecord,
  CharacterHealthStates, 
  CharacterHealthState,
  CharacterHealthStatesByLocation,
  GameModel
} from 'sr2020-mm-event-engine';
import * as moment from 'moment-timezone';

import { charHealthIndexToList } from "./charHealthUtils";

const changeEventName = 'characterHealthStatesLoaded';
const srcDataName = 'characterHealthStates';
const dstDataName = 'characterHealthByLocations';
const initState: CharacterHealthStatesByLocation[] = [];

// const objToList = (objItem2ListItem) => R.pipe(R.toPairs, R.map(objItem2ListItem));
// const mergeKeyNEntry = (idName) => ([id, data2]) => ({ [idName]: Number(id), ...data2 });

// function getUserNameStr(user) {
//   return user && user.name !== '' ? ` (${user.name})` : '';
// }

export interface WithCharacterHealthStatesForMap {
  [dstDataName]: CharacterHealthStatesByLocation[]
};

interface IndexValue {
  characters: CharacterHealthState[];
  location: LocationRecord;
  locationId: number;
}

// const labels = marker.options.clinicalDeathIds.map((id) => id + this.getUserNameStr(gameModel.get({
//   type: 'userRecord',
//   id: Number(id),
// })));

export const withCharacterHealthStatesForMap = (Wrapped: any) => (props: object & {gameModel: GameModel}) => {
  const { gameModel } = props;
  const [data, setData] = useState(initState);

  function update(event: {[srcDataName]: CharacterHealthStates}) {
    const newData: CharacterHealthStates = event[srcDataName];

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
    const fullList2 = fullList.filter((el) => el.locationId !== null).filter(isRelevant(timestamp));
    // TS hardcoded type
    const locIdGetter = R.prop('locationId') as (a: CharacterHealthState) => string;
    const locationIndex = R.groupBy(locIdGetter, fullList2);

    const updatedIndex = R.mapObjIndexed((characters, locationId) => {
      const location: LocationRecord = gameModel.get({
        type: 'locationRecord',
        id: Number(locationId),
      });
      return {
        characters,
        location,
        locationId: Number(locationId),
      };
    }, locationIndex);

    // const objToList(mergeKeyNEntry('locationId'))(locationIndex);
    const list = R.values(updatedIndex);
    // @ts-ignore
    const isDrawableLoc = (el: IndexValue) => el.location && !R.equals(el.location.polygon, {});
    const filteredList = list.filter(isDrawableLoc);
    if (list.length !== filteredList.length) {
      console.error('Some locations not found or not valid', list.filter((el) => !isDrawableLoc(el)));
    }
    setData(filteredList);
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
