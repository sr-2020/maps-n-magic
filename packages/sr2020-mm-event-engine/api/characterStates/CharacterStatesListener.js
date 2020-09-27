import * as R from 'ramda';
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
    const { characterId, stateFrom, stateTo } = data;
    const locationId = await getCharacterLocation(characterId, true);
    this.updateState(characterId, locationId, stateTo);
  }

  updateState(characterId, locationId, healthState) {
    this.gameModel.execute({
      type: 'setCharacterHealthState',
      characterId,
      characterHealthState: {
        locationId,
        healthState,
      },
    });

    // gameModel.execute({
    //   type: 'setCharacterHealthState',
    //   characterId,
    //   characterHealthState: {
    //     locationId: getRandomEl(locations).id,
    //     healthState: getRandomEl(healthStates),
    //   },
    // });
    // setCharacterHealthState({ characterId, characterHealthState })
    // characterStates[characterId] = {
    //   locationId,
    //   healthState,
    // };
  }
}
