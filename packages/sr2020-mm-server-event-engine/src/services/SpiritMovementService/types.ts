import { 
  GameModel,
  GMLogger,
  SpiritRoute,
  TimetableItem,
} from 'sr2020-mm-event-engine';

export interface SpiritRouteContext {
  routeIndex: Record<number, SpiritRoute | undefined>;
  moscowTimeInMinutes: number;
  dateNow: number;
  logger: GMLogger;
  gameModel: GameModel;
}

export type CurRouteSearchRes = undefined | {
  route: SpiritRoute;
  timetableItem: TimetableItem;
  // hasOverflow: boolean;
}