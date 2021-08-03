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
  GMLogger, 
  RawSpellCast
} from "sr2020-mm-event-engine";
import shortid from 'shortid';

import { listenSpellCasts } from './listenSpellCasts';
import { mmLog } from '../spirits/mmLog';

const metadata = {
  actions: [],
  requests: [],
  emitEvents: [],
  listenEvents: [],
  needRequests: [],
  needActions: ['spellCast']
};

export class SpellCastsListener extends AbstractEventProcessor {

  constructor(protected gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.onMessageRecieved = this.onMessageRecieved.bind(this);
    listenSpellCasts(this.onMessageRecieved, true);
    this.setMetadata({
      emitEvents: ["spellCast"],
    });
  }

  async onMessageRecieved(data: RawSpellCast): Promise<void> {
    // this.logger.info(data);
    this.gameModel.emit2<ESpellCast>({
      type: 'spellCast',
      data: {
        ...data,
        uid: shortid.generate()
      }
    });
    // mmLog('SPELL_CAST', JSON.stringify(data));
  }
}
