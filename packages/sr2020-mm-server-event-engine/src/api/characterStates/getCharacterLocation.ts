import * as R from 'ramda';
import fetch from 'isomorphic-fetch';
import { RawUserRecord, validateRawUserRecord } from "sr2020-mm-event-engine";

import { mainServerConstants } from '../constants';
import { createLogger } from '../../utils';

const logger = createLogger('getCharacterLocation.ts');

// const locations = null;


// const t: RawUserRecord = {
// 	"id": 51935,
// 	"location_id": 3215,
// 	// "created_at": "2020-11-09 22:45:47",
// 	// "updated_at": "2021-06-15 02:04:26",
// 	"location": {
// 		"id": 3215,
// 		"label": "Межрайонье 1",
// 		"polygon": {
// 			"0": [
// 				{
// 					"lat": 54.929353280120619,
// 					"lng": 36.87302201994499
// 				},
// 				{
// 					"lat": 54.9291853949252,
// 					"lng": 36.873314380727617
// 				},
// 				{
// 					"lat": 54.92917153281354,
// 					"lng": 36.87372744091591
// 				},
// 				{
// 					"lat": 54.92934249852361,
// 					"lng": 36.87341630467018
// 				}
// 			]
// 		},
// 		"options": {
// 			"manaLevel": 2,
// 			"effectList": []
// 		},
// 		"layer_id": 1
// 	}
// };

export async function getCharacterLocation(characterId: number, simulateLocation = false): Promise<{
  locationId: number | null,
  locationLabel: string
}> {
  const response = await fetch(`${mainServerConstants().usersUrl}/${characterId}`, {
  // const response = await fetch(`${url}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'X-User-Id': "1",
    },
  });

  if (!response.ok) {
    try {
      const text = await response.text();
      // throw new Error(`Network response was not ok ${text}`);
      throw new Error(`getCharacterLocation network response was not ok ${characterId} ${response.ok} ${response.statusText}`);
    } catch (err) {
      // logger.error(err);
      logger.error(err.message || err);
    }
    return {
      locationId: null,
      locationLabel: 'N/A',
    };
  }

  const result: RawUserRecord = await response.json();

  if (!validateRawUserRecord(result)) {
    logger.error(`Received invalid getCharacterLocation. ${JSON.stringify(result)} ${JSON.stringify(validateRawUserRecord.errors)}`);
  } else {
    // logger.info('getCharacterLocation validation OK');
  }

  // logger.info('getCharacterLocation ' + JSON.stringify(result));
  if (R.isNil(result.location_id)) {
    return {
      locationId: null,
      locationLabel: 'N/A',
    };
    // if (!locations) {
    //   const rawLocations = await getLocations();
    //   locations = rawLocations.filter(isGeoLocation);
    //   // logger.info(rawLocations.length, locations.length);
    // }
    // return locations[randomInteger(0, locations.length - 1)].id;
  }

  return {
    locationId: result.location_id,
    locationLabel: result.location?.label || 'N/A',
  };
}
// async function getLocations() {
//   const response = await fetch(`${locationsUrl}`, {
//   // const response = await fetch(`${url}`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json;charset=utf-8',
//       'X-User-Id': "1",
//     },
//   });

//   if (!response.ok) {
//     const text = await response.text();
//     throw new Error(`Network response was not ok ${text}`);
//   }

//   return response.json();
// }

// exports.getCharacterLocation = getCharacterLocation;
