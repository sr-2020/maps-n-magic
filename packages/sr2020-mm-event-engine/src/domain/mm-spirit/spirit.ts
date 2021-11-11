import Ajv, { JSONSchemaType } from "ajv";

import { SpiritState, spiritStateSchema } from "./spiritState";
import { SpiritTimetable, timetableItemSchema } from "./spiritTimetable";


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
  // maxHitPoints: 10,
  hitPoints: 1,
  level: 1,
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
    hitPoints: {type: "integer", minimum: 1, maximum: 6},
    level: {type: "integer", minimum: 1, maximum: 3},
    story: {type: "string"},
    abilities: {type: "array", items: {type: "string"}},
    timetable: { type: "array", items: timetableItemSchema},
    state: spiritStateSchema
  },
  required: [
    "name", 
    "id", 
    "fraction", 
    "story", 
    "abilities", 
    "timetable",
    "state",
    'hitPoints',
    'level'
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
    hitPoints: {type: "integer", minimum: 1, maximum: 6},
    level: {type: "integer", minimum: 1, maximum: 3},
    story: {type: "string"},
    abilities: {type: "array", items: {type: "string"}},
    // maxHitPoints: {type: "integer", minimum: 1},
    timetable: { type: "array", items: timetableItemSchema},
    state: spiritStateSchema
  },
  required: [
    "name", 
    "fraction", 
    "story", 
    "abilities", 
    // "maxHitPoints",
    "timetable",
    "state",
    'hitPoints',
    'level'
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
