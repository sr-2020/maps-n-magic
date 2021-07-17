
import Ajv, { JSONSchemaType } from "ajv";

import { 
  SpiritState,
  NotInGameState,
  RestInAstralState,
  InJarState,
  SuitedState,
  TimetableItem,
  OnRouteState,
  DoHealState
} from 'sr2020-mm-event-engine';

import { spiritRouteSchema } from "./spiritRouteValidation";

export const timetableItemSchema: JSONSchemaType<TimetableItem> = {
  type: "object",
  properties: {
    routeId: {type: 'integer'},
    speedPercent: {type: 'integer', enum: [25, 50, 75, 100, 125, 150, 175, 200]},
    time: {type: 'integer', minimum: 0, exclusiveMaximum: 1440}
  },
  required: ['routeId', 'speedPercent', 'time'],
  additionalProperties: false,
};

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
    'characterId', 
    'suitStartTime', 
    'suitDuration', 
    'suitStatus',
    'bodyStorageId'
  ],
  additionalProperties: false,
  properties: {
    status: {
      type: 'string',
      const: 'Suited',
    },
    characterId: { type: 'number' },
    suitStartTime: { type: 'number' },
    suitDuration: { type: 'number' },
    suitStatus: { type: 'string', enum: ['normal', 'emergencyDispirited', 'suitTimeout'] },
    suitStatusChangeTime: { type: 'number' },
    bodyStorageId: { type: 'number' },
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
