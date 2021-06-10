import Ajv, { JSONSchemaType } from "ajv";

import { 
  SettingsData
} from "./index";

const ajv = new Ajv({
  allErrors: true,
  // removeAdditional: true,
  // useDefaults: true
});

// Mana ocean settings

export interface ManaOceanSettingsData extends SettingsData {
  minManaLevel: number;
  neutralManaLevel: number;
  maxManaLevel: number;
  visibleMoonPeriod: number;
  visibleMoonNewMoonTime: number;
  visibleMoonManaTideHeight: number;
  invisibleMoonPeriod: number;
  invisibleMoonNewMoonTime: number;
  invisibleMoonManaTideHeight: number;
  // moscowTime: number;
};

export interface ManaOceanEffectSettingsData extends SettingsData {
  massacreDelay: number;
  massacreDuration: number;
  powerSpellBoundary: number;
  powerSpellDelay: number;
  powerSpellDuration: number;
  ritualMembersBoundary: number;
  ritualDelay: number;
  spellDurationItem: number;
  spellProbabilityPerPower: number;
  spellDurationPerPower: number;
}

export interface MoonProps {
  period: number;
  offset: number;
}

export interface TidePeriodProps {
  startTime: number;
  value: number;
  intervalDuration?: number;
};

// Mana ocean effects

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