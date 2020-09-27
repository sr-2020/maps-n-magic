// const fetch = require('node-fetch');
import * as R from 'ramda';
import { isGeoLocation } from '../../utils';
// const { isGeoLocation } = require('sr2020-mm-event-engine/utils');

import { usersUrl, locationsUrl } from '../constants';

let locations = null;

function randomInteger(min, max) {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

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
    const text = await response.text();
    throw new Error(`Network response was not ok ${text}`);
  }

  const result = await response.json();
  if (R.isNil(result.location_id)) {
    if (!locations) {
      const rawLocations = await getLocations();
      locations = rawLocations.filter(isGeoLocation);
      // console.log(rawLocations.length, locations.length);
    }
    return locations[randomInteger(0, locations.length - 1)].id;
  }

  return result.location_id;
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
