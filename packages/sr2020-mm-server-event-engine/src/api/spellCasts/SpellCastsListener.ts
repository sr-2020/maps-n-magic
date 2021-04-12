import * as R from 'ramda';
import moment from 'moment-timezone';
// import { getCharacterLocation } from './getCharacterLocation';
// import { getCharacterLifeStyle } from './getCharacterLifeStyle';
// import { listenHealthChanges } from './listenHealthChanges';
import { GameModel, SpellCast, SpellCastAction } from "sr2020-mm-event-engine";

import { listenSpellCasts } from './listenSpellCasts';

// const { listenHealthChanges } = require('./listenHealthChanges');
// const { getCharacterLocation } = require('./getCharacterLocation');

const metadata = {
  actions: [],
  requests: [],
  emitEvents: [],
  listenEvents: [],
  needRequests: [],
  needActions: ['spellCast']
};

export class SpellCastsListener {
  gameModel: GameModel;

  constructor(gameModel: GameModel) {
    this.gameModel = gameModel;
    this.onMessageRecieved = this.onMessageRecieved.bind(this);
    listenSpellCasts(this.onMessageRecieved, true);
  }

  async onMessageRecieved(data: SpellCast): Promise<void> {
    // console.log(data);
    this.gameModel.execute2<SpellCastAction>({
      type: 'spellCast',
      data,
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
