import * as R from 'ramda';
import moment from 'moment-timezone';
// import { getCharacterLocation } from './getCharacterLocation';
// import { getCharacterLifeStyle } from './getCharacterLifeStyle';
// import { listenHealthChanges } from './listenHealthChanges';
import { 
  GameModel, 
  SpellCast, 
  ESpellCast, 
  AbstractEventProcessor,
  GMLogger 
} from "sr2020-mm-event-engine";

import { listenSpellCasts } from './listenSpellCasts';
import { mmLog } from '../spirits/mmLog';

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

export class SpellCastsListener extends AbstractEventProcessor {
  // gameModel: GameModel;

  constructor(protected gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    // this.gameModel = gameModel;
    this.onMessageRecieved = this.onMessageRecieved.bind(this);
    listenSpellCasts(this.onMessageRecieved, true);
    this.setMetadata({
      emitEvents: ["spellCast"],
    });
  }

  async onMessageRecieved(data: SpellCast): Promise<void> {
    // this.logger.info(data);
    this.gameModel.emit2<ESpellCast>({
      type: 'spellCast',
      data,
    });
    mmLog('SPELL_CAST', JSON.stringify(data));
    // // this.logger.info('onMessageRecieved');
    // // const { characterId } = this.logger.info(data);
    // const {
    //   characterId, stateFrom, stateTo, timestamp,
    // } = data;
    // const [{ locationId, locationLabel }, { lifeStyle, personName }] = await Promise.all([
    //   getCharacterLocation(characterId, true),
    //   getCharacterLifeStyle(characterId),
    // ]);
    // // this.logger.info('lifeStyle', lifeStyle, 'personName', personName);
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
  //   // this.logger.info('received timestamp', timestamp, ', cur moment().utc()', moment.utc().valueOf());
  //   // this.gameModel.execute({
  //   //   type: 'putCharHealth',
  //   //   characterId,
  //   //   characterHealthState,
  //   // });
  // }
}
