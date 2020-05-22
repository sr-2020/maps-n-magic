const express = require('express');

const router = express.Router();

const R = require('ramda');
const { listenHealthChanges } = require('./listenHealthChanges');
const { getCharacterLocation } = require('./getCharacterLocation');

const characterStates = {};

async function onMessageRecieved(data) {
  // const { characterId } = console.log(data);
  const { characterId, stateFrom, stateTo } = data;
  const locationId = await getCharacterLocation(characterId, true);
  characterStates[characterId] = {
    locationId,
    healthState: stateTo,
  };
  // console.log({
  //   characterId,
  //   locationId,
  //   healthState: stateTo,
  // });
}

function getCharacterStates() {
  return R.clone(characterStates);
}

router.get('/characterStates', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(getCharacterStates());
});

listenHealthChanges(onMessageRecieved, true);

module.exports = router;
