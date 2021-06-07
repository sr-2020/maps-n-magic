import * as R from 'ramda';

import { 
  AbstractService, 
  Metadata,
  GMLogger,
  GameModel,
  Typed,
  ServiceContract,
  ServiceContractTypes,
  GetSpirits,
  GetSpiritRoutes,
  Spirit,
  SpiritStatusList,
  getMoscowTime,
  getTimeOnRoute,
  SpiritRoute,
  SpiritTimetable,
  TimetableItem,
  EPutSpiritsRequested,
  GetEnableSpiritMovement
} from 'sr2020-mm-event-engine';

const SPIRIT_UPDATE_INTERVAL: number = 5000; // millis

const groupByStatus = R.groupBy<Spirit, SpiritStatusList>(R.path(['state','status']) as (a: any) => SpiritStatusList);
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

function isInSemiInterval(from: number, time: number, to: number): boolean {
  return from <= time && time < to;
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
    this.logger.info('enableSpiritMovement', enableSpiritMovement)

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


    // this.logger.info('onSpiritUpdate');
    // const spirits = this.getFromModel2('spirits');
    // const spiritRoutes = this.getFromModel2('spiritRoutes');
    // const spiritIndex = groupByStatus(spirits);
    // const routeIndex: Record<number, SpiritRoute | undefined> = R.indexBy(R.prop('id'), spiritRoutes);
    // const { moscowTimeInMinutes } = getMoscowTime();
    // if (spiritIndex.RestInAstral.length > 0) {
    //   const restingSpirits = spiritIndex.RestInAstral;
    //   restingSpirits.forEach(spirit => {
    //     const { timetable, name } = spirit;
    //     if (timetable.length === 0) {
    //       this.logger.info(`Spirit ${spirit.name} ${spirit.id} is in game but there is no routes in its timetable`);
    //       return;
    //     }
    //     // this.logger.info(spirit.name);
    //     const timetableItem = this.findCurRoute(spirit, routeIndex, moscowTimeInMinutes);
    //     if (timetableItem === undefined) {
    //       return;
    //     }
    //     // move to route
    //     this.logger.info(`spirit ${name}`, timetableItem);
    //   });
    // }
  }

  private findCurRoute(
    spirit: Spirit, 
    routeIndex: Record<number, SpiritRoute | undefined>, 
    moscowTimeInMinutes: number
  ): TimetableItem | undefined {
    const { timetable, name } = spirit;
    return timetable.find(timetableItem => {
      const { routeId, speedPercent, time } = timetableItem;
      const route = routeIndex[routeId];
      if (route === undefined) {
        this.logger.warn(`Spirit ${name} has missing route ${routeId}`);
        return false;
      }
      const { timeOnRoute, timeOnWaypoint } = getTimeOnRoute(route, speedPercent);

      const hasOverflow = time + timeOnRoute > 1440;
      if (hasOverflow) {
        return isInSemiInterval(time, moscowTimeInMinutes, 1440)
          || isInSemiInterval(0, moscowTimeInMinutes, time + timeOnRoute - 1440);
      } else {
        return isInSemiInterval(time, moscowTimeInMinutes, time + timeOnRoute);
      }
    });
  }
  // pushNotification(data: PushNotification) {
  //   // this.logger.info('pushNotification', data);
  //   this.emit2({
  //     ...data,
  //     type: 'pushNotification',
  //   });
  // }
}
