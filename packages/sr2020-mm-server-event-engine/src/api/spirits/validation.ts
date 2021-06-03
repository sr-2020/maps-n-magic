
import Ajv, { JSONSchemaType } from "ajv";

import { 
  Spirit,
  SpiritState,
  NotInGameState,
  RestInAstralState,
  SpiritFraction,
  SpiritRoute,
  TimetableItem,
} from 'sr2020-mm-event-engine';

const ajv = new Ajv({
  allErrors: true,
  removeAdditional: true,
  useDefaults: true
});

const timetableSchema: JSONSchemaType<TimetableItem> = {
  type: "object",
  properties: {
    routeId: {type: 'integer'},
    speedPercent: {type: 'integer', enum: [25, 50, 75, 100, 125, 150, 175, 200], default: 100},
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

const spiritStateSchema: JSONSchemaType<SpiritState> = {
  oneOf: [
    notInGameStateSchema, 
    restInAstralStateSchema
  ]
};

const spiritSchema: JSONSchemaType<Spirit> = {
  type: "object",
  properties: {
    id: {type: "integer"},
    name: {type: "string", default: ""},
    // aura: {type: "string"},
    fraction: {type: "integer", default: 1},
    story: {type: "string", default: ""},
    abilities: {type: "array", items: {type: "string"}, default: []},
    maxHitPoints: {type: "integer", minimum: 1, default: 10},
    timetable: { type: "array", items: timetableSchema, default: []},
    state: spiritStateSchema
  },
  required: [
    "name", 
    "id", 
    "fraction", 
    "story", 
    "abilities", 
    "maxHitPoints",
    "timetable",
    "state"
  ],
  additionalProperties: false,
}

export const validateSpirit = ajv.compile(spiritSchema);

const newSpiritSchema: JSONSchemaType<Omit<Spirit, "id">> = {
  type: "object",
  properties: {
    // id: {type: "integer"},
    name: {type: "string", default: ""},
    // aura: {type: "string"},
    fraction: {type: "integer", default: 1},
    story: {type: "string", default: ""},
    abilities: {type: "array", items: {type: "string"}, default: []},
    maxHitPoints: {type: "integer", minimum: 1, default: 10},
    timetable: { type: "array", items: timetableSchema, default: []},
    state: spiritStateSchema
  },
  required: [
    "name", 
    "fraction", 
    "story", 
    "abilities", 
    "maxHitPoints",
    "timetable",
    "state"
  ],
  additionalProperties: false,
}

export const validateNewSpirit = ajv.compile(newSpiritSchema);


export interface GenericRow {
  id: number;
  data: object;
  // { id: 31, data: { name: 'spiritName', health: 10 } }
}

const genericRowSchema: JSONSchemaType<GenericRow> = {
  type: "object",
  properties: {
    id: { type: "integer" },
    data: { type: "object", required: [] },
  },
  required: ["data", "id"],
  additionalProperties: false,
}

export const validateGenericRow = ajv.compile(genericRowSchema);

const spiritFractionSchema: JSONSchemaType<SpiritFraction> = {
  type: "object",
  properties: {
    id: {type: "integer"},
    name: {type: "string", default: ""},
  },
  required: ["name", "id"],
  additionalProperties: false,
}

export const validateSpiritFraction = ajv.compile(spiritFractionSchema);

const spiritRouteSchema: JSONSchemaType<SpiritRoute> = {
  type: "object",
  properties: {
    id: {type: "integer"},
    name: {type: "string", default: ""},
    waypoints: {type: "array", items: {type: "number"}, default: []},
    waitTimeMinutes: {type: "integer", default: 5, minimum: 1},
  },
  required: ["name", "id", "waypoints", "waitTimeMinutes"],
  additionalProperties: false,
}

export const validateSpiritRoute = ajv.compile(spiritRouteSchema);

const newSpiritRouteSchema: JSONSchemaType<Omit<SpiritRoute, "id">> = {
  type: "object",
  properties: {
    name: {type: "string", default: ""},
    waypoints: {type: "array", items: {type: "number"}, default: []},
    waitTimeMinutes: {type: "integer", default: 5, minimum: 1},
  },
  required: ["name", "waypoints", "waitTimeMinutes"],
  additionalProperties: false,
}

export const validateNewSpiritRoute = ajv.compile(newSpiritRouteSchema);
