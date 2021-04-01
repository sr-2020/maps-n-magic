import * as R from 'ramda';
import { 
  GameModel, 
  GMLogger
} from 'sr2020-mm-event-engine';
import { sendNotification } from './sendNotification';
import { PushNotificationArgs } from "../../index";

const metadata = {
  actions: [],
  requests: [],
  emitEvents: [],
  listenEvents: ['pushNotification'],
  needRequests: [],
  needActions: []
};

export class PushNotificationEmitter {
  constructor(
    private gameModel: GameModel, 
    private logger: GMLogger
  ) {
    this.onPushNotification = this.onPushNotification.bind(this);
  }

  initialize() {
    this.subscribe('on', this.gameModel);
  }

  dispose() {
    this.subscribe('off', this.gameModel);
  }

  // eslint-disable-next-line react/sort-comp
  subscribe(action: 'on'|'off', gameModel: GameModel) {
    gameModel[action]('pushNotification', this.onPushNotification);
  }

  onPushNotification(data: PushNotificationArgs): void {
    this.logger.info('pushNotification', data);
    const { characterId, title, message } = data;
    sendNotification(characterId, title, message);
  }
}
