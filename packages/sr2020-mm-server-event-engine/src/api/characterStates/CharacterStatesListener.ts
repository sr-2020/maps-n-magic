import * as R from 'ramda';
import moment from 'moment-timezone';
import { getCharacterLocation } from './getCharacterLocation';
import { getCharacterLifeStyle } from './getCharacterLifeStyle';
import { listenHealthChanges } from './listenHealthChanges';

// const { listenHealthChanges } = require('./listenHealthChanges');
// const { getCharacterLocation } = require('./getCharacterLocation');

export class CharacterStatesListener {
  gameModel: any;

  constructor(gameModel) {
    this.gameModel = gameModel;
    this.onMessageRecieved = this.onMessageRecieved.bind(this);
    listenHealthChanges(this.onMessageRecieved, true);
  }

  async onMessageRecieved(data) {
    // console.log('onMessageRecieved');
    // const { characterId } = console.log(data);
    const {
      characterId, stateFrom, stateTo, timestamp,
    } = data;
    const [{ locationId, locationLabel }, { lifeStyle, personName }] = await Promise.all([
      getCharacterLocation(characterId, true),
      getCharacterLifeStyle(characterId),
    ]);
    // console.log('lifeStyle', lifeStyle, 'personName', personName);
    this.updateState(characterId, {
      locationId,
      locationLabel,
      healthState: stateTo,
      timestamp,
      lifeStyle,
      personName,
    });
  }

  updateState(characterId, characterHealthState) {
    // console.log('received timestamp', timestamp, ', cur moment().utc()', moment.utc().valueOf());
    this.gameModel.execute({
      type: 'putCharHealth',
      characterId,
      characterHealthState,
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
