import Ajv, { JSONSchemaType } from "ajv";

export interface AbstractManaOceanEffect {
  id: string;
  start: number;
  manaLevelChange: number;
  locationId: number;
}

export interface RitualLocationEffect extends AbstractManaOceanEffect {
  type: 'ritualLocation',
  permanent: true;
  neighborId?: number;
}

export interface PowerSpellEffect extends AbstractManaOceanEffect {
  type: 'powerSpell';
  end: number;
}

export interface SpellEffect extends AbstractManaOceanEffect {
  type: 'inputStream' | 'outputStream',
  end: number;
  range: number[];
  prevNeighborIds?: number[];
}

export interface MassacreEffect extends AbstractManaOceanEffect {
  type: 'massacre';
  end: number;
}

export type ManaOceanEffect = 
  RitualLocationEffect | 
  PowerSpellEffect | 
  SpellEffect | 
  MassacreEffect;


// const abstractManaOceanEffectSchema: JSONSchemaType<AbstractManaOceanEffect> = {
//   type: "object",
//   properties: {
//     id: {type: "string"},
//     start: {type: "integer"},
//     manaLevelChange: {type: "integer"},
//     locationId: {type: "integer"},
//   },
//   required: ["id", "start", "manaLevelChange", "locationId"],
//   // additionalProperties: false,
// }

const ritualLocationEffectSchema: JSONSchemaType<RitualLocationEffect> = {
  type: "object",
  properties: {
    id: {type: "string"},
    start: {type: "integer"},
    manaLevelChange: {type: "integer"},
    locationId: {type: "integer"},
    //
    type: {type: "string", const: "ritualLocation"},
    permanent: {type: "boolean"},
    neighborId: {type: "integer", nullable: true},
  },
  // required: ["type", "permanent", ...abstractManaOceanEffectSchema.required],
  required: [
    "id", "start", "manaLevelChange", "locationId", 
    "type", "permanent"
  ],
  // additionalProperties: false,
}

const powerSpellEffectSchema: JSONSchemaType<PowerSpellEffect> = {
  type: "object",
  properties: {
    id: {type: "string"},
    start: {type: "integer"},
    manaLevelChange: {type: "integer"},
    locationId: {type: "integer"},
    //
    type: {type: "string", const: "powerSpell"},
    end: {type: "integer"},
  },
  required: [
    "id", "start", "manaLevelChange", "locationId", 
    "type", "end"
  ],
  // additionalProperties: false,
}

const spellEffectSchema: JSONSchemaType<SpellEffect> = {
  type: "object",
  properties: {
    id: {type: "string"},
    start: {type: "integer"},
    manaLevelChange: {type: "integer"},
    locationId: {type: "integer"},
    //
    type: {type: "string", enum: ["inputStream", "outputStream"]},
    end: {type: "integer"},
    range: {type: "array", items: {type: "integer"}},
    prevNeighborIds: {type: "array", items: {type: "integer"}, nullable: true},
  },
  required: [
    "id", "start", "manaLevelChange", "locationId", 
    "type", "end", "range"
  ],
  // additionalProperties: false,
}

// "type": "massacre",
// "id": "58ly2smt7",
// "start": 1604432340150,
// "end": 1604434140150,
// "manaLevelChange": 1

const massacreEffectSchema: JSONSchemaType<MassacreEffect> = {
  type: "object",
  properties: {
    id: {type: "string"},
    start: {type: "integer"},
    manaLevelChange: {type: "integer"},
    locationId: {type: "integer"},
    //
    type: {type: "string", const: "massacre"},
    end: {type: "integer"},
    // range: {type: "array", items: {type: "integer"}},
    // prevNeighborIds: {type: "array", items: {type: "integer"}, nullable: true},
  },
  required: [
    "id", "start", "manaLevelChange", "locationId", 
    "type", "end"
  ],
  // additionalProperties: false,
}

export const manaOceanEffectSchema: JSONSchemaType<ManaOceanEffect> = {
  oneOf: [
    ritualLocationEffectSchema,
    powerSpellEffectSchema,
    spellEffectSchema,
    massacreEffectSchema
  ]
};