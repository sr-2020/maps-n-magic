import * as R from 'ramda';

import { AbstractService } from '../core/AbstractService';

import { Metadata } from "../core/types";

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
  constructor() {
    super();
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
