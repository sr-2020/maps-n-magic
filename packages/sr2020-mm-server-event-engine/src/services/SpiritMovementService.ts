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
  GetEnableSpiritMovement,
  OnRouteState,
  SpiritStatus,
  SpiritState,
  RestInAstralState
} from 'sr2020-mm-event-engine';

const SPIRIT_UPDATE_INTERVAL: number = 5000; // millis

const defaultSpiritIndex: Record<SpiritStatusList, Spirit[]> = {
  NotInGame: [],
  OnRoute: [],
  RestInAstral: [],
};

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

type CurRouteSearchRes = undefined | {
  route: SpiritRoute;
  timetableItem: TimetableItem;
  // hasOverflow: boolean;
}

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
    const spiritIndex = {
      ...defaultSpiritIndex, 
      ...groupByStatus(spirits)
    };;
    const routeIndex: Record<number, SpiritRoute | undefined> = R.indexBy(R.prop('id'), spiritRoutes);
    const { moscowTimeInMinutes } = getMoscowTime();

    if (spiritIndex.OnRoute.length > 0) {
      const onRouteSpirits = spiritIndex.OnRoute;
      onRouteSpirits.map(spirit => {
        return this.getUpdatedOnRouteState(spirit, routeIndex, moscowTimeInMinutes);
      });
    }

    if (spiritIndex.RestInAstral.length > 0) {
      const restingSpirits = spiritIndex.RestInAstral;
      restingSpirits.map((spirit): OnRouteState | undefined => {
        return this.getOnRouteState(spirit, routeIndex, moscowTimeInMinutes);
      });
    }
  }

  private getUpdatedOnRouteState(
    spirit: Spirit, 
    routeIndex: Record<number, SpiritRoute | undefined>, 
    moscowTimeInMinutes: number
  ): OnRouteState | RestInAstralState | undefined {
    const state = spirit.state;
    if (state.status !== SpiritStatus.OnRoute) {
      this.logger.warn('Trying getUpdatedOnRouteState in non route spirit', spirit);
      return undefined;
    }
    const { timetableItem, route, waypointIndex } = state;
    const { timeOnWaypoint } = getTimeOnRoute(route, timetableItem.speedPercent);
    const res = getWaypointIndex(moscowTimeInMinutes, timetableItem.time, timeOnWaypoint);
    if (res !== undefined) {
      const { waypointIndex: newWaypointIndex } = res;
      if (waypointIndex === newWaypointIndex) {
        // no changes, spirit still in the same location
        return undefined;
      }
      // spirit still on the route
      if (route.waypoints.length > waypointIndex) {
        const newState: OnRouteState = {
          ...state,
          waypointIndex: newWaypointIndex
        };
        return newState;
      }
    }
    // spirit ends route case
    // Consider spirit as RestInAstral state - check if it has some route right now
    // TODO - check if spirit has other route
    const onRouteState = this.getOnRouteState(spirit, routeIndex, moscowTimeInMinutes);
    if (onRouteState === undefined) {
      return onRouteState;
    }
    return {
      status: SpiritStatus.RestInAstral
    };
  }

  private getOnRouteState(
    spirit: Spirit, 
    routeIndex: Record<number, SpiritRoute | undefined>, 
    moscowTimeInMinutes: number
  ): OnRouteState | undefined {
    const { timetable, name } = spirit;
    if (timetable.length === 0) {
      this.logger.info(`Spirit ${spirit.name} ${spirit.id} is in game but there is no routes in its timetable`);
      return undefined;
    }
    // this.logger.info(spirit.name);
    const searchRes = this.findCurRoute(spirit, routeIndex, moscowTimeInMinutes);
    if (searchRes === undefined) {
      return undefined;
    }
    // move to route
    // this.logger.info(`spirit ${name}`, searchRes);

    const { 
      // hasOverflow, 
      route, 
      timetableItem 
    } = searchRes;
    const { timeOnRoute, timeOnWaypoint } = getTimeOnRoute(route, timetableItem.speedPercent);
    const res = getWaypointIndex(moscowTimeInMinutes, timetableItem.time, timeOnWaypoint);
    if (res === undefined) {
      this.logger.warn(`getWaypointIndex returns undefined when spirit is definitely on the route`, {
        spirit,
        searchRes,
        timeOnRoute, 
        timeOnWaypoint
      });
      return undefined;
    }
    // transform clock time to current route time
    const { curRouteTime, waypointIndex } = res;
    // this.logger.info(`spirit ${name}`, {
    //   'timetableItem.time': timetableItem.time,
    //   moscowTimeInMinutes, 
    //   timeOnRoute, 
    //   timeOnWaypoint, 
    //   curRouteTime, 
    //   waypointIndex
    // });

    const newState: OnRouteState = {
      status: SpiritStatus.OnRoute,
      timetableItem: {...timetableItem},
      route: R.clone(route),
      waypointIndex,
      // hasOverflow
    };
    return newState;
  }

  private findCurRoute(
    spirit: Spirit, 
    routeIndex: Record<number, SpiritRoute | undefined>, 
    moscowTimeInMinutes: number
  ): CurRouteSearchRes {
    const { timetable, name } = spirit;
    return timetable.reduce((acc: CurRouteSearchRes, timetableItem) => {
      if (acc !== undefined) {
        return acc;
      }
      const { routeId, speedPercent, time } = timetableItem;
      const route = routeIndex[routeId];
      if (route === undefined) {
        this.logger.warn(`Spirit ${name} has missing route ${routeId}`);
        return acc;
      }
      const { timeOnRoute, timeOnWaypoint } = getTimeOnRoute(route, speedPercent);

      // const hasOverflow = time + timeOnRoute > 1440;
      let isHit;
      // if (hasOverflow) {
      //   // these conditions are identical
      //   isHit = isInSemiInterval(time, moscowTimeInMinutes, time + timeOnRoute)
      //     || isInSemiInterval(time, moscowTimeInMinutes + 1440, time + timeOnRoute);
      //   // return isInSemiInterval(time, moscowTimeInMinutes, 1440)
      //   //   || isInSemiInterval(0, moscowTimeInMinutes, time + timeOnRoute - 1440);
      // } else {
        isHit = isInSemiInterval(time, moscowTimeInMinutes, time + timeOnRoute);
      // }
      if (!isHit) {
        return acc;
      }
      return {
        route,
        timetableItem,
        // hasOverflow
      };
    }, undefined);
  }
  // pushNotification(data: PushNotification) {
  //   // this.logger.info('pushNotification', data);
  //   this.emit2({
  //     ...data,
  //     type: 'pushNotification',
  //   });
  // }
}
function getWaypointIndex(
  moscowTimeInMinutes: number, 
  timetableItemTime: number, 
  // hasOverflow: boolean, 
  timeOnWaypoint: number
) {
  const curRouteTime = moscowTimeInMinutes - timetableItemTime;
  if (curRouteTime < 0) {
    return undefined;
  }
  //  + (hasOverflow ? 1440 : 0);
  const waypointIndex = Math.floor(curRouteTime / timeOnWaypoint);
  return { curRouteTime, waypointIndex };
}

