import * as R from 'ramda';

import { 
  AbstractService, 
  Metadata, 
  GameModel, 
  GMLogger,
  Typed
} from '../../core';

export interface PostNotificationArgs {
  title: string;
  message: string;
  kind: 'error' | 'success' | 'warning' | 'info';
}

export type PostNotification = Typed<'postNotification', PostNotificationArgs>;
export type EPostNotification = Typed<'postNotification', PostNotificationArgs>;

export type PostNotificationEvents = EPostNotification;

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

export class NotificationService extends AbstractService<PostNotificationEvents> {
  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(metadata);
  }

  postNotification({ title = '', message = '', kind = 'info' }: PostNotification): void {
    this.emit2({
      type: 'postNotification',
      title,
      message,
      kind,
    });
  }
}
