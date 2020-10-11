import * as R from 'ramda';
import moment from 'moment-timezone';
// import { getCharacterLocation } from './getCharacterLocation';
// import { getCharacterLifeStyle } from './getCharacterLifeStyle';
// import { listenHealthChanges } from './listenHealthChanges';
import { listenSpellCasts } from './listenSpellCasts';

// const { listenHealthChanges } = require('./listenHealthChanges');
// const { getCharacterLocation } = require('./getCharacterLocation');

export class SpellCastsListener {
  constructor(gameModel) {
    this.gameModel = gameModel;
    this.onMessageRecieved = this.onMessageRecieved.bind(this);
    listenSpellCasts(this.onMessageRecieved, true);
  }

  async onMessageRecieved(data) {
    // console.log(data);
    this.gameModel.execute({
      type: 'spellCast',
      ...data,
    });
    // // console.log('onMessageRecieved');
    // // const { characterId } = console.log(data);
    // const {
    //   characterId, stateFrom, stateTo, timestamp,
    // } = data;
    // const [{ locationId, locationLabel }, { lifeStyle, personName }] = await Promise.all([
    //   getCharacterLocation(characterId, true),
    //   getCharacterLifeStyle(characterId),
    // ]);
    // // console.log('lifeStyle', lifeStyle, 'personName', personName);
    // this.updateState(characterId, {
    //   locationId,
    //   locationLabel,
    //   healthState: stateTo,
    //   timestamp,
    //   lifeStyle,
    //   personName,
    // });
  }

  // updateState(characterId, characterHealthState) {
  //   // console.log('received timestamp', timestamp, ', cur moment().utc()', moment.utc().valueOf());
  //   // this.gameModel.execute({
  //   //   type: 'putCharHealth',
  //   //   characterId,
  //   //   characterHealthState,
  //   // });
  // }
}
