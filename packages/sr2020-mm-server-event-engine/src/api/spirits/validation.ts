
import Ajv, { JSONSchemaType } from "ajv";

import { 
  Spirit,
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
    // latLng: {
    //   type: "object",
    //   properties: {
    //   }
    // }
  },
  required: [
    "name", 
    "id", 
    "fraction", 
    "story", 
    "abilities", 
    "maxHitPoints",
    "timetable"
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
    // fraction: {type: "string", default: ""},
    fraction: {type: "integer", default: 1},
    story: {type: "string", default: ""},
    abilities: {type: "array", items: {type: "string"}, default: []},
    maxHitPoints: {type: "integer", minimum: 1, default: 10},
    timetable: { type: "array", items: timetableSchema, default: []},
    // latLng: {
    //   type: "object",
    //   properties: {
    //   }
    // }
  },
  required: [
    "name", 
    "fraction", 
    "story", 
    "abilities", 
    "maxHitPoints",
    "timetable"
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
