import * as R from 'ramda';

import { AbstractService } from './AbstractService';

export class NotificationService extends AbstractService {
  metadata = {
    actions: [
      'postNotification',
    ],
    requests: [],
    emitEvents: [
      'postNotification',
    ],
    listenEvents: [],
  };

  postNotification({ title = '', message = '', kind = 'info' }) {
    this.emit('postNotification', {
      title,
      message,
      kind,
    });
  }
}
