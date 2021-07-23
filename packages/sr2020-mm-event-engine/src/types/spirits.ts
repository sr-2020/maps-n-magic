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
  DoHeal: 'DoHeal',
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
  spiritId: number;
  spiritName: string;
  characterId: number;
  suitStartTime: number;
  suitDuration: number;
  suitStatus: 'normal' | 'emergencyDispirited' | 'suitTimeout';
  suitStatusChangeTime: number;
  bodyStorageId: number;
  message: string | null;
}

export interface DoHealState {
  status: typeof SpiritStatus.DoHeal;
  healStartTime: number;
}

export type consequenceStatus = 'noConsequences' | 'woundConsequence' | 'deathConsequence';

export type SpiritState = 
  | NotInGameState 
  | RestInAstralState 
  | OnRouteState
  | InJarState
  | SuitedState
  | DoHealState
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

export interface SpiritPhrase {
  id: number;
  startDate: number;
  endDate: number;
  message: string;
}