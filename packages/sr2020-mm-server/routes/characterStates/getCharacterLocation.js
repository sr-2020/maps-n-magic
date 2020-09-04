const fetch = require('node-fetch');
const R = require('ramda');

// /api/v1/users/{id}
const url = 'https://position.evarun.ru/api/v1/users';
const locationUrl = 'https://position.evarun.ru/api/v1/locations';

let locations = null;

function isGeoLocation(location) {
  return location.layer_id === 1 && !R.isEmpty(location.polygon);
}

function randomInteger(min, max) {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

async function getCharacterLocation(characterId, simulateLocation = false) {
  const response = await fetch(`${url}/${characterId}`, {
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
  const response = await fetch(`${locationUrl}`, {
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

exports.getCharacterLocation = getCharacterLocation;
