import * as R from 'ramda';

import { 
  AbstractService, 
  Metadata,
  GMLogger,
  GameModel,
  Typed,
  EPushNotification,
  PushNotification,
  ServiceContract,
  ServiceContractTypes
} from 'sr2020-mm-event-engine';


export type PushNotificationEvents = EPushNotification;

export interface PushNotificationServiceContract extends ServiceContract {
  Request: never;
  Action: PushNotification;
  EmitEvent: EPushNotification;
  ListenEvent: never;
  NeedAction: never;
  NeedRequest: never;
}

const metadata: ServiceContractTypes<PushNotificationServiceContract> = {
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

export class PushNotificationService extends AbstractService<PushNotificationServiceContract> {
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

