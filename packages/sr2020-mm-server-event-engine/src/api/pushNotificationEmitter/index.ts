import * as R from 'ramda';
import { 
  GameModel, 
  GMLogger,
  AbstractEventProcessor,
} from 'sr2020-mm-event-engine';
import { sendNotification } from './sendNotification';
import { PushNotificationArgs, EPushNotification } from "../../index";

// const metadata = {
//   actions: [],
//   requests: [],
//   emitEvents: [],
//   listenEvents: ['pushNotification'],
//   needRequests: [],
//   needActions: []
// };

export class PushNotificationEmitter extends AbstractEventProcessor {
  constructor(
    gameModel: GameModel, 
    logger: GMLogger
  ) {
    super(gameModel, logger);
    this.onPushNotification = this.onPushNotification.bind(this);
    this.setMetadata({
      listenEvents: ["pushNotification"]
    })
  }

  init() {
    this.subscribe('on2', this.gameModel);
  }

  dispose() {
    this.subscribe('off2', this.gameModel);
  }

  // eslint-disable-next-line react/sort-comp
  subscribe(action: 'on2'|'off2', gameModel: GameModel) {
    gameModel[action]('pushNotification', this.onPushNotification);
  }

  onPushNotification(data: EPushNotification): void {
    this.logger.info('pushNotification', data);
    const { characterId, title, message } = data;
    sendNotification(characterId, title, message);
  }
}
