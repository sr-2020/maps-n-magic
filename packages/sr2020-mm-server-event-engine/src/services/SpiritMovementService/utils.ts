import * as R from 'ramda';

import { 
  SpiritRoute,
} from 'sr2020-mm-event-engine';

export const getRouteIndex: (routes: SpiritRoute[]) => 
  Record<number, SpiritRoute | undefined> = R.indexBy(R.prop('id'));

export function getWaypointIndex(
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

export function isInSemiInterval(from: number, time: number, to: number): boolean {
  return from <= time && time < to;
}

