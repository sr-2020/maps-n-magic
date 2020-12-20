// const fetch = require('node-fetch');
import * as R from 'ramda';
import { isGeoLocation, randomInteger } from 'sr2020-mm-event-engine/utils';
// const { isGeoLocation } = require('sr2020-mm-event-engine/utils');

import { usersUrl, locationsUrl } from '../constants';

const locations = null;

export async function getCharacterLocation(characterId, simulateLocation = false) {
  const response = await fetch(`${usersUrl}/${characterId}`, {
  // const response = await fetch(`${url}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'X-User-Id': 1,
    },
  });

  if (!response.ok) {
    try {
      const text = await response.text();
      throw new Error(`Network response was not ok ${text}`);
    } catch (err) {
      console.error(err);
    }
    return {
      locationId: null,
      locationLabel: 'N/A',
    };
  }

  const result = await response.json();
  if (R.isNil(result.location_id)) {
    return {
      locationId: null,
      locationLabel: 'N/A',
    };
    // if (!locations) {
    //   const rawLocations = await getLocations();
    //   locations = rawLocations.filter(isGeoLocation);
    //   // console.log(rawLocations.length, locations.length);
    // }
    // return locations[randomInteger(0, locations.length - 1)].id;
  }

  return {
    locationId: result.location_id,
    locationLabel: result.location.label,
  };
}
async function getLocations() {
  const response = await fetch(`${locationsUrl}`, {
  // const response = await fetch(`${url}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'X-User-Id': 1,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Network response was not ok ${text}`);
  }

  return response.json();
}

// getCharacterLocation(10198, true).then(console.log).catch(console.log);
// getCharacterLocation(10198).then((data) => console.log(R.pluck('id', data))).catch(console.log);

// exports.getCharacterLocation = getCharacterLocation;
