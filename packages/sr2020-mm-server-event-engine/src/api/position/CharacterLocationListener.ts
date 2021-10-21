import * as R from 'ramda';
import moment from 'moment-timezone';
import { 
  GameModel,
  EPutCharLocationRequested,
  AbstractEventProcessor,
  GMLogger,
  CharLocationMessage,
} from 'sr2020-mm-event-engine';
import { PubSubDataSource } from '../../dataManagers/types';

// const metadata = {
//   actions: [],
//   requests: [],
//   emitEvents: [],
//   listenEvents: [],
//   needRequests: [],
//   needActions: ['putCharLocation']
// };

export class CharacterLocationListener extends AbstractEventProcessor {
  constructor(
    gameModel: GameModel, 
    protected pubSubDataSource: PubSubDataSource<CharLocationMessage>,
    logger: GMLogger
  ) {
    super(gameModel, logger);
    this.onMessageRecieved = this.onMessageRecieved.bind(this);
    this.pubSubDataSource.on('message', this.onMessageRecieved);
    this.setMetadata({
      emitEvents: ["putCharLocationRequested"]
    });
  }

  dispose() {
    this.pubSubDataSource.off('message', this.onMessageRecieved);
  }

  async onMessageRecieved(data: CharLocationMessage) {
    // this.logger.info('onMessageRecieved');
    // this.logger.info(data);
    const {
      id, locationId, prevLocationId,
    } = data;
    // this.logger.info('received timestamp', timestamp, ', cur moment().utc()', moment.utc().valueOf());
    // this.gameModel.execute2<PutCharLocation>({
    //   type: 'putCharLocation',
    this.gameModel.emit2<EPutCharLocationRequested>({
      type: 'putCharLocationRequested',
      characterId: id,
      locationId,
      prevLocationId,
    });
  }
}
