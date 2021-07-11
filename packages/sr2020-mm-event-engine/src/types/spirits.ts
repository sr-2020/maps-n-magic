export const speedPercentValues = [25, 50, 75, 100, 125, 150, 175, 200];

export interface TimetableItem {
  routeId: number;
  time: number; // minutes, from 0:00 to 23:59 (23*60 + 59 = 1439)
  speedPercent: number; // 25%, 50%, 75%, ... 200%
}

export type SpiritTimetable = TimetableItem[];

export const SpiritStatus = {
  NotInGame: 'NotInGame',
  RestInAstral: 'RestInAstral',
  OnRoute: 'OnRoute',
  InJar: 'InJar',
  Suited: 'Suited',
} as const;

export type SpiritStatusList = keyof typeof SpiritStatus;

interface AbstractState {
  status: keyof typeof SpiritStatus;
}

export interface NotInGameState extends AbstractState {
  status: typeof SpiritStatus.NotInGame;
}

export interface RestInAstralState {
  status: typeof SpiritStatus.RestInAstral;
}

export interface OnRouteState {
  status: typeof SpiritStatus.OnRoute;
  route: SpiritRoute;
  timetableItem: TimetableItem;
  waypointIndex: number;
}

export interface InJarState {
  status: typeof SpiritStatus.InJar;
  qrId: number;
}

export interface SuitedState {
  status: typeof SpiritStatus.Suited;
  characterId: number;
  currentTime: number;
  duration: number;
  emergencyDispirited: boolean;
}

export type SpiritState = 
  | NotInGameState 
  | RestInAstralState 
  | OnRouteState
  | InJarState
  | SuitedState
;

export interface Spirit {
  id: number;
  name: string;
  // aura: string,
  fraction: number; // fraction id number
  timetable: SpiritTimetable;
  state: SpiritState;

  story: string;
  abilities: string[];

  // latLng: L.LatLngLiteral,
  // plane: string,
  hitPoints: number;
  level: number;
  // maxHitPoints: number,
}

export interface SpiritFraction {
  id: number;
  name: string;
  abilities: string[];
}

export interface SpiritRoute {
  id: number;
  name: string;
  waypoints: number[];
  waitTimeMinutes: number;
}