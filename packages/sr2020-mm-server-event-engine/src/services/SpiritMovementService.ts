import * as R from 'ramda';

import { 
  AbstractService, 
  Metadata,
  GMLogger,
  GameModel,
  Typed,
  ServiceContract,
  ServiceContractTypes
} from 'sr2020-mm-event-engine';

const SPIRIT_UPDATE_INTERVAL: number = 5000; // millis

export interface SpiritMovementServiceContract extends ServiceContract {
  Request: never;
  Action: never;
  EmitEvent: never;
  ListenEvent: never;
  NeedAction: never;
  NeedRequest: never;
}

const metadata: ServiceContractTypes<SpiritMovementServiceContract> = {
  actions: [
    // 'pushNotification',
  ],
  requests: [],
  emitEvents: [
    // 'pushNotification',
  ],
  listenEvents: [],
  needActions: [],
  needRequests: []
};

export class SpiritMovementService extends AbstractService {
  spiritUpdateTimerId: NodeJS.Timeout | null = null;

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(metadata);
    this.onSpiritUpdate = this.onSpiritUpdate.bind(this);
  }

  init(): void {
    super.init();
    if (this.spiritUpdateTimerId === null) {
      this.spiritUpdateTimerId = setInterval(this.onSpiritUpdate, SPIRIT_UPDATE_INTERVAL);
    } else {
      this.logger.error('spiritUpdateTimer already initialized');
    }
  }

  dispose(): void {
    if (this.spiritUpdateTimerId !== null) {
      clearInterval(this.spiritUpdateTimerId);
    }
  }

  onSpiritUpdate() {
    this.logger.info('onSpiritUpdate');
  }

  // pushNotification(data: PushNotification) {
  //   // this.logger.info('pushNotification', data);
  //   this.emit2({
  //     ...data,
  //     type: 'pushNotification',
  //   });
  // }
}
