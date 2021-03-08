import * as R from 'ramda';

import { 
  AbstractService, 
  Metadata,
  GMLogger,
  GameModel
} from 'sr2020-mm-event-engine';

const metadata: Metadata = {
  actions: [
    'pushNotification',
  ],
  requests: [],
  emitEvents: [
    'pushNotification',
  ],
  listenEvents: [],
  needActions: [],
  needRequests: []
};

export class PushNotificationService extends AbstractService {
  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(metadata);
  }

  pushNotification(data) {
    // this.logger.info('pushNotification', data);
    this.emit('pushNotification', {
      type: 'pushNotification',
      ...data,
    });
  }
}
