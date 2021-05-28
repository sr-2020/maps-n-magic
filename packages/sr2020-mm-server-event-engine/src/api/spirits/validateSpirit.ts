
import Ajv, { JSONSchemaType } from "ajv";

import { 
  Spirit,
  SpiritFraction
} from 'sr2020-mm-event-engine';

const ajv = new Ajv({
  allErrors: true,
  removeAdditional: true,
  useDefaults: true
});

const spiritSchema: JSONSchemaType<Spirit> = {
  type: "object",
  properties: {
    id: {type: "integer"},
    name: {type: "string", default: ""},
    // aura: {type: "string"},
    // fraction: {type: "string", default: ""},
    fraction: {type: "integer", default: 1},
    story: {type: "string", default: ""},
    abilities: {type: "array", items: {type: "string"}, default: []},
    maxHitPoints: {type: "integer", minimum: 1, default: 10},
    // latLng: {
    //   type: "object",
    //   properties: {
    //   }
    // }
  },
  required: ["name", "id", "fraction", "story", "abilities", "maxHitPoints"],
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
    // latLng: {
    //   type: "object",
    //   properties: {
    //   }
    // }
  },
  required: ["name", "fraction", "story", "abilities", "maxHitPoints"],
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