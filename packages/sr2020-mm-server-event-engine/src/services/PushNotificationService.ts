import * as R from 'ramda';

import { 
  AbstractService, 
  Metadata,
  GMLogger,
  GameModel,
  Typed
} from 'sr2020-mm-event-engine';

export interface PushNotificationArgs {
  characterId: number;
  title: string;
  message: string;
}

export type PushNotification = Typed<'pushNotification', PushNotificationArgs>;
export type EPushNotification = Typed<'pushNotification', PushNotificationArgs>;

export type PushNotificationEvents = EPushNotification;

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

export class PushNotificationService extends AbstractService<PushNotificationEvents> {
  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(metadata);
  }

  pushNotification(data: PushNotification) {
    // this.logger.info('pushNotification', data);
    this.emit2({
      ...data,
      type: 'pushNotification',
    });
  }
}

