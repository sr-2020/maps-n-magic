import Ajv, { JSONSchemaType } from "ajv";

import { SpiritRoute, spiritRouteSchema } from "./spiritRoute";
import { TimetableItem, timetableItemSchema } from "./spiritTimetable";

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

export type SpiritState = 
  | NotInGameState 
  | RestInAstralState 
  | OnRouteState
  | InJarState
  | SuitedState
  | DoHealState
;



const notInGameStateSchema: JSONSchemaType<NotInGameState> = {
  type: 'object',
  required: ['status'],
  additionalProperties: false,
  properties: {
    status: {
      type: 'string',
      const: 'NotInGame',
    }
  }
};

const restInAstralStateSchema: JSONSchemaType<RestInAstralState> = {
  type: 'object',
  required: ['status'],
  additionalProperties: false,
  properties: {
    status: {
      type: 'string',
      const: 'RestInAstral',
    }
  }
};

const onRouteStateSchema: JSONSchemaType<OnRouteState> = {
  type: 'object',
  required: ['status', 'route', 'timetableItem', 'waypointIndex'],
  additionalProperties: false,
  properties: {
    status: {
      type: 'string',
      const: 'OnRoute',
    },
    route: spiritRouteSchema,
    timetableItem: timetableItemSchema,
    waypointIndex: { type: 'number' }
  }
};

const inJarStateSchema: JSONSchemaType<InJarState> = {
  type: 'object',
  required: ['status', 'qrId'],
  additionalProperties: false,
  properties: {
    status: {
      type: 'string',
      const: 'InJar',
    },
    qrId: { type: 'number' }
  }
};

const doHealStateSchema: JSONSchemaType<DoHealState> = {
  type: 'object',
  required: ['status', 'healStartTime'],
  additionalProperties: false,
  properties: {
    status: {
      type: 'string',
      const: 'DoHeal',
    },
    healStartTime: { type: 'number' }
  }
};

const suitedStateSchema: JSONSchemaType<SuitedState> = {
  type: 'object',
  required: [
    'status', 
    'spiritId',
    'spiritName',
    'characterId', 
    'suitStartTime', 
    'suitDuration', 
    'suitStatus',
    'bodyStorageId',
    'message'
  ],
  additionalProperties: false,
  properties: {
    status: {
      type: 'string',
      const: 'Suited',
    },
    characterId: { type: 'number' },
    spiritId: { type: 'number' },
    spiritName: { type: 'string' },
    suitStartTime: { type: 'number' },
    suitDuration: { type: 'number' },
    suitStatus: { type: 'string', enum: ['normal', 'emergencyDispirited', 'suitTimeout'] },
    suitStatusChangeTime: { type: 'number' },
    bodyStorageId: { type: 'number' },
    message: { type: 'string', nullable: true },
  }
};

export const spiritStateSchema: JSONSchemaType<SpiritState> = {
  oneOf: [
    notInGameStateSchema, 
    restInAstralStateSchema,
    onRouteStateSchema,
    inJarStateSchema,
    suitedStateSchema,
    doHealStateSchema,
  ]
};
