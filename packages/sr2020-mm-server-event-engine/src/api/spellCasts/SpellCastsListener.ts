import * as R from 'ramda';
import moment from 'moment-timezone';
import { 
  GameModel, 
  SpellCast, 
  ESpellCast, 
  AbstractEventProcessor,
  GMLogger, 
  RawSpellCast,
} from "sr2020-mm-event-engine";
import shortid from 'shortid';

import { mmLog } from '../spirits/mmLog';
import { PubSubDataSource } from '../../dataManagers/types';

// const metadata = {
//   actions: [],
//   requests: [],
//   emitEvents: ['spellCast'],
//   listenEvents: [],
//   needRequests: [],
//   needActions: []
// };

export class SpellCastsListener extends AbstractEventProcessor<ESpellCast> {
  constructor(
    protected gameModel: GameModel, 
    protected pubSubDataSource: PubSubDataSource<RawSpellCast>,
    logger: GMLogger
  ) {
    super(gameModel, logger);
    this.onMessageRecieved = this.onMessageRecieved.bind(this);
    this.pubSubDataSource.on('message', this.onMessageRecieved);
    this.setMetadata({
      emitEvents: ["spellCast"],
    });
  }

  dispose() {
    this.pubSubDataSource.off('message', this.onMessageRecieved);
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
    // mmLog(his.gameModel, 'SPELL_CAST', JSON.stringify(data));
  }
}
