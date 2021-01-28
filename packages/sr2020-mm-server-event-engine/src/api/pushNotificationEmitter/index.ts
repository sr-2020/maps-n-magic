import * as R from 'ramda';
import { sendNotification } from './sendNotification';

export class PushNotificationEmitter {
  gameModel: any;

  logger: any;

  constructor(gameModel, logger) {
    this.gameModel = gameModel;
    this.logger = logger;
    this.onPushNotification = this.onPushNotification.bind(this);
  }

  initialize() {
    this.subscribe('on', this.gameModel);
  }

  dispose() {
    this.subscribe('off', this.gameModel);
  }

  // eslint-disable-next-line react/sort-comp
  subscribe(action, gameModel) {
    gameModel[action]('pushNotification', this.onPushNotification);
  }

  onPushNotification(data) {
    this.logger.info('pushNotification', data);
    const { characterId, title, message } = data;
    sendNotification(characterId, title, message);
  }
}
