// const express = require('express');

// const router = express.Router();

// const R = require('ramda');
// const { listenHealthChanges } = require('./listenHealthChanges');
// const { getCharacterLocation } = require('./getCharacterLocation');

// const characterStates = {};

// const bodyConditions = [
//   'healthy',
//   'wounded',
//   'clinically_dead',
//   'biologically_dead',
// ];

// // async function onMessageRecieved(data) {
// //   // const { characterId } = console.log(data);
// //   const { characterId, stateFrom, stateTo } = data;
// //   const locationId = await getCharacterLocation(characterId, true);
// //   updateState(characterId, locationId, stateTo);
// // }

// function updateState(characterId, locationId, healthState) {
//   characterStates[characterId] = {
//     locationId,
//     healthState,
//   };
// }

// function getCharacterStates() {
//   return R.clone(characterStates);
// }

// router.get('/characterStates', (req, res) => {
//   res.setHeader('Content-Type', 'application/json');
//   res.json(getCharacterStates());
// });

// router.put('/characterStates', (req, res) => {
//   // res.setHeader('Content-Type', 'application/json');
//   console.log('Received simulated characterState message', req.body);
//   const {
//     characterId,
//     locationId,
//     healthState,
//   } = req.body;
//   const errors = [];
//   if (R.isNil(characterId)) {
//     errors.push('characterId is absent');
//   } else if (!R.is(Number, characterId)) {
//     errors.push('characterId is not a number');
//   }
//   if (R.isNil(locationId)) {
//     errors.push('locationId is absent');
//   } else if (!R.is(Number, locationId)) {
//     errors.push('locationId is not a number');
//   }
//   if (R.isNil(healthState)) {
//     errors.push('healthState is absent');
//   } else if (!R.includes(healthState, bodyConditions)) {
//     errors.push(`healthState ${healthState} is not from list ${JSON.stringify(bodyConditions)}`);
//   }
//   if (R.isEmpty(errors)) {
//     updateState(characterId, locationId, healthState);
//     res.status(200).end();
//   } else {
//     res.setHeader('Content-Type', 'application/json');
//     res.status(400).json({ errors });
//   }
// });

// // listenHealthChanges(onMessageRecieved, true);

// module.exports = router;
