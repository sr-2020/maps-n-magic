
import Ajv, { JSONSchemaType } from "ajv";

import { 
  Spirit,
} from 'sr2020-mm-event-engine';

import { spiritStateSchema, timetableItemSchema } from "./spiritStateValidation";

const ajv = new Ajv({
  allErrors: true,
  // removeAdditional: true,
  // useDefaults: true
});

const defaultSpirit: Omit<Spirit, "id"> = {
  name: '',
  fraction: 1, // без фракции
  story: '',
  abilities: [],
  maxHitPoints: 10,
  timetable: [],
  state: {
    status: 'NotInGame'
  }
};

const spiritSchema: JSONSchemaType<Spirit> = {
  type: "object",
  properties: {
    id: {type: "integer"},
    name: {type: "string"},
    // aura: {type: "string"},
    fraction: {type: "integer"},
    story: {type: "string"},
    abilities: {type: "array", items: {type: "string"}},
    maxHitPoints: {type: "integer", minimum: 1},
    timetable: { type: "array", items: timetableItemSchema},
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
};

export const validateSpirit = ajv.compile(spiritSchema);

const newSpiritSchema: JSONSchemaType<Omit<Spirit, "id">> = {
  type: "object",
  properties: {
    // id: {type: "integer"},
    name: {type: "string"},
    // aura: {type: "string"},
    fraction: {type: "integer"},
    story: {type: "string"},
    abilities: {type: "array", items: {type: "string"}},
    maxHitPoints: {type: "integer", minimum: 1},
    timetable: { type: "array", items: timetableItemSchema},
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
};

export const validateNewSpirit = ajv.compile(newSpiritSchema);

export function fillNewSpirit(spirit: Partial<Omit<Spirit, "id">>): Omit<Spirit, "id"> {
  return {
    ...defaultSpirit,
    ...spirit
  };
}



