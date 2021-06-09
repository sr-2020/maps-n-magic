import * as R from 'ramda';

import { 
  AbstractService, 
  GMLogger,
  GameModel,
  ServiceContract,
  ServiceContractTypes,
  GetSpirits,
  GetSpiritRoutes,
  getMoscowTime,
  SpiritRoute,
  EPutSpiritsRequested,
  GetEnableSpiritMovement,
  PutSpiritArgs
} from 'sr2020-mm-event-engine';

import { getRouteIndex } from "./utils";

import { getNewSpiritState } from "./stateProcessing";

const SPIRIT_UPDATE_INTERVAL: number = 5000; // millis

export interface SpiritMovementServiceContract extends ServiceContract {
  Request: never;
  Action: never;
  EmitEvent: EPutSpiritsRequested;
  ListenEvent: never;
  NeedAction: never;
  NeedRequest: 
    | GetSpirits
    | GetSpiritRoutes
    | GetEnableSpiritMovement;
}

const metadata: ServiceContractTypes<SpiritMovementServiceContract> = {
  actions: [
    // 'pushNotification',
  ],
  requests: [],
  emitEvents: [
    'putSpiritsRequested',
    // 'pushNotification',
  ],
  listenEvents: [],
  needActions: [],
  needRequests: ['spirits', 'spiritRoutes', 'enableSpiritMovement']
};

export class SpiritMovementService extends AbstractService<SpiritMovementServiceContract> {
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
    const enableSpiritMovement = this.getFromModel2('enableSpiritMovement');
    this.logger.info('enableSpiritMovement', enableSpiritMovement);
    if (!enableSpiritMovement) {
      return;
    }

    // Test spirit update task
    // const spirits = this.getFromModel2('spirits');
    // this.emit2({
    //   type: 'putSpiritsRequested',
    //   updates: spirits.map(spirit => ({
    //     id: spirit.id,
    //     props: {
    //       fraction: spirit.fraction === 4 ? 1 : spirit.fraction + 1
    //     }
    //   }))
    // });


    this.logger.info('onSpiritUpdate');
    const spirits = this.getFromModel2('spirits');
    const spiritRoutes = this.getFromModel2('spiritRoutes');
    
    const routeIndex: Record<number, SpiritRoute | undefined> = getRouteIndex(spiritRoutes);
    const { moscowTimeInMinutes } = getMoscowTime();

    const updates = spirits.reduce((acc: PutSpiritArgs[], spirit) => {
      const newState = getNewSpiritState(spirit, {
        routeIndex, 
        moscowTimeInMinutes,
        logger: this.logger
      });
      if (newState !== undefined) {
        acc.push({
          id: spirit.id,
          props: {
            state: newState
          }
        });
      }
      return acc;
    }, []);

    this.logger.info('updates', updates);
  }

  // pushNotification(data: PushNotification) {
  //   // this.logger.info('pushNotification', data);
  //   this.emit2({
  //     ...data,
  //     type: 'pushNotification',
  //   });
  // }
}






