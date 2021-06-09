import { 
  GMLogger,
  SpiritRoute,
  TimetableItem,
} from 'sr2020-mm-event-engine';

export interface SpiritRouteContext {
  routeIndex: Record<number, SpiritRoute | undefined>;
  moscowTimeInMinutes: number;
  logger: GMLogger;
}

export type CurRouteSearchRes = undefined | {
  route: SpiritRoute;
  timetableItem: TimetableItem;
  // hasOverflow: boolean;
}