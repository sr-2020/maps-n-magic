import * as R from 'ramda';

import { 
  Spirit,
  getTimeOnRoute,
  OnRouteState,
  SpiritStatus,
  SpiritState,
  RestInAstralState,
  SuitedState,
} from 'sr2020-mm-event-engine';
import { createLogger } from '../../logger';

import { SpiritRouteContext, CurRouteSearchRes } from "./types";

import { getWaypointIndex, isInSemiInterval, getRouteIndex } from "./utils";

const logger = createLogger('stateProcessing.ts');

export function getNewSpiritState(
  spirit: Spirit,
  context: SpiritRouteContext,
): SpiritState | undefined {
  const { state } = spirit;
  let newState: SpiritState | undefined;
  if (state.status === 'RestInAstral') {
    newState = getOnRouteState(spirit, context);
  }
  if (state.status === 'OnRoute') {
    newState = getUpdatedOnRouteState(spirit, context);
  }
  if (state.status === 'Suited') {
    newState = getUpdatedSuitedState(spirit, context);
  }
  return newState;
}

function getUpdatedSuitedState(
  spirit: Spirit, 
  context: SpiritRouteContext,
): SuitedState | undefined {
  const { logger, moscowTimeInMinutes, dateNow } = context;
  const state = spirit.state;
  if (state.status !== SpiritStatus.Suited) {
    logger.warn('Trying getUpdatedSuitedState in suited spirit', spirit);
    return undefined;
  }
  const { suitStatus, currentTime, duration } = state;
  if (suitStatus !== 'normal') {
    return undefined;
  }
  if ((currentTime + duration) < dateNow ) {
    const newState: SuitedState = {
      ...state,
      suitStatus: 'suitTimeout'
    };
    logger.info(`TIMEOUT_DISPIRIT triggered ${spirit.id} ${spirit.name}. Data ${JSON.stringify({
      state
    })}`);
    return newState;
  }
  return undefined;
}


function getUpdatedOnRouteState(
  spirit: Spirit, 
  context: SpiritRouteContext,
): OnRouteState | RestInAstralState | undefined {
  const { logger, moscowTimeInMinutes } = context;
  const state = spirit.state;
  if (state.status !== SpiritStatus.OnRoute) {
    logger.warn('Trying getUpdatedOnRouteState in non route spirit', spirit);
    return undefined;
  }
  const { timetableItem, route, waypointIndex } = state;
  const { timeOnRoute, timeOnWaypoint } = getTimeOnRoute(route, timetableItem.speedPercent);
  const res = getWaypointIndex(moscowTimeInMinutes, timetableItem.time, timeOnWaypoint);
  if (res !== undefined) {
    // logger.info('getWaypointIndex', { 
    //   ...res, 
    //   timeOnRoute, 
    //   timeOnWaypoint, 
    //   moscowTimeInMinutes, 
    //   timetableItemTime: 
    //   timetableItem.time 
    // });
    const { waypointIndex: newWaypointIndex, curRouteTime } = res;
    if (curRouteTime > timeOnRoute) {
      // Consider spirit as RestInAstral state - check if it has some route right now
    } else if (waypointIndex === newWaypointIndex) { // spirit still on the route
      // no changes, spirit still in the same location
      return undefined;
    } else {
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
  const onRouteState = getOnRouteState(spirit, context);
  // logger.info('onRouteState', onRouteState); 
  if (onRouteState !== undefined) {
    return onRouteState;
  }
  return {
    status: SpiritStatus.RestInAstral
  };
}

function getOnRouteState(
  spirit: Spirit, 
  context: SpiritRouteContext,
): OnRouteState | undefined {
  const { logger, moscowTimeInMinutes } = context;
  const { timetable, name } = spirit;
  if (timetable.length === 0) {
    logger.info(`Spirit ${spirit.name} ${spirit.id} is in game but there is no routes in its timetable`);
    return undefined;
  }
  // this.logger.info(spirit.name);
  const searchRes = findCurRoute(spirit, context);
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
    logger.warn(`getWaypointIndex returns undefined when spirit is definitely not on the route`, {
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

function findCurRoute(
  spirit: Spirit, 
  context: SpiritRouteContext,
): CurRouteSearchRes {
  const { logger, moscowTimeInMinutes, routeIndex } = context;
  const { timetable, name } = spirit;
  return timetable.reduce((acc: CurRouteSearchRes, timetableItem) => {
    if (acc !== undefined) {
      return acc;
    }
    const { routeId, speedPercent, time } = timetableItem;
    const route = routeIndex[routeId];
    if (route === undefined) {
      logger.warn(`Spirit ${name} has missing route ${routeId}`);
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
