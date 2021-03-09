import * as R from 'ramda';

import { 
  AbstractService, 
  Metadata, 
  GameModel, 
  GMLogger 
} from '../../core';

const metadata: Metadata = {
  actions: [
    'postNotification',
  ],
  requests: [],
  emitEvents: [
    'postNotification',
  ],
  listenEvents: [],
  needRequests: [],
  needActions: [],
};

export class NotificationService extends AbstractService {
  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(metadata);
  }

  postNotification({ title = '', message = '', kind = 'info' }) {
    this.emit('postNotification', {
      type: 'postNotification',
      title,
      message,
      kind,
    });
  }
}
