import * as R from 'ramda';

import { AbstractService } from 'sr2020-mm-event-engine/core/AbstractService';

export class PushNotificationService extends AbstractService {
  metadata = {
    actions: [
      'pushNotification',
    ],
    requests: [],
    emitEvents: [
      'pushNotification',
    ],
    listenEvents: [],
  };

  pushNotification(data) {
    // this.logger.info('pushNotification', data);
    this.emit('pushNotification', {
      type: 'pushNotification',
      ...data,
    });
  }
}
