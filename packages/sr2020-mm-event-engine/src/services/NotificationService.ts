import * as R from 'ramda';

import { AbstractService } from '../core/AbstractService';

const metadata = {
  actions: [
    'postNotification',
  ],
  requests: [],
  emitEvents: [
    'postNotification',
  ],
  listenEvents: [],
};
export class NotificationService extends AbstractService {
  constructor(logger) {
    super(logger);
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
