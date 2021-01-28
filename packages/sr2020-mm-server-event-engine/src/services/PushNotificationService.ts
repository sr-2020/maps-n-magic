import * as R from 'ramda';

import { AbstractService } from 'sr2020-mm-event-engine/core/AbstractService';

const metadata = {
  actions: [
    'pushNotification',
  ],
  requests: [],
  emitEvents: [
    'pushNotification',
  ],
  listenEvents: [],
};
export class PushNotificationService extends AbstractService {
  constructor(logger) {
    super(logger);
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
