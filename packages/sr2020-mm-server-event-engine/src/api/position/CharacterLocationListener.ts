import * as R from 'ramda';
import moment from 'moment-timezone';
// import { getCharacterLocation } from './getCharacterLocation';
// import { getCharacterLifeStyle } from './getCharacterLifeStyle';
import { listenCharacterLocations } from './listenCharacterLocations';

// const { listenHealthChanges } = require('./listenHealthChanges');
// const { getCharacterLocation } = require('./getCharacterLocation');

export class CharacterLocationListener {
  gameModel: any;

  constructor(gameModel) {
    this.gameModel = gameModel;
    this.onMessageRecieved = this.onMessageRecieved.bind(this);
    listenCharacterLocations(this.onMessageRecieved, true);
  }

  async onMessageRecieved(data) {
    // console.log('onMessageRecieved');
    // const { characterId } = console.log(data);
    const {
      id, locationId, prevLocationId,
    } = data;
    // const [{ locationId, locationLabel }, { lifeStyle, personName }] = await Promise.all([
    //   getCharacterLocation(characterId, true),
    //   getCharacterLifeStyle(characterId),
    // ]);
    // console.log('lifeStyle', lifeStyle, 'personName', personName);
    this.updateState(id, locationId, prevLocationId);
  }

  updateState(characterId, locationId, prevLocationId) {
    // console.log('received timestamp', timestamp, ', cur moment().utc()', moment.utc().valueOf());
    this.gameModel.execute({
      type: 'putCharLocation',
      characterId,
      locationId,
      prevLocationId,
    });
  }
}
