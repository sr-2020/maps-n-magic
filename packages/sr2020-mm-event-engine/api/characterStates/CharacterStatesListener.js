import * as R from 'ramda';
import moment from 'moment-timezone';
import { getCharacterLocation } from './getCharacterLocation';
import { listenHealthChanges } from './listenHealthChanges';

// const { listenHealthChanges } = require('./listenHealthChanges');
// const { getCharacterLocation } = require('./getCharacterLocation');

const bodyConditions = [
  'healthy',
  'wounded',
  'clinically_dead',
  'biologically_dead',
];

export class CharacterStatesListener {
  constructor(gameModel) {
    this.gameModel = gameModel;
    this.onMessageRecieved = this.onMessageRecieved.bind(this);
    listenHealthChanges(this.onMessageRecieved, true);
  }

  async onMessageRecieved(data) {
    console.log('onMessageRecieved');
    // const { characterId } = console.log(data);
    const {
      characterId, stateFrom, stateTo, timestamp,
    } = data;
    const locationId = await getCharacterLocation(characterId, true);
    this.updateState(characterId, locationId, stateTo, timestamp);
  }

  updateState(characterId, locationId, healthState, timestamp) {
    console.log('received timestamp', timestamp, ', cur moment().utc()', moment.utc().valueOf());
    this.gameModel.execute({
      type: 'putCharHealth',
      characterId,
      characterHealthState: {
        locationId,
        healthState,
        timestamp,
      },
    });

    // gameModel.execute({
    //   type: 'putCharHealth',
    //   characterId,
    //   characterHealthState: {
    //     locationId: getRandomEl(locations).id,
    //     healthState: getRandomEl(healthStates),
    //   },
    // });
    // putCharHealth({ characterId, characterHealthState })
    // characterStates[characterId] = {
    //   locationId,
    //   healthState,
    // };
  }
}
