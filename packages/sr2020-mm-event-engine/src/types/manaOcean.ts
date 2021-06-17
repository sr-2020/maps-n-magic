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

// export const defaultManaOceanSettings: ManaOceanSettingsData = {
//   minManaLevel: 1,
//   neutralManaLevel: 4,
//   maxManaLevel: 7,
//   visibleMoonPeriod: 180, // minutes
//   visibleMoonNewMoonTime: 0,
//   visibleMoonManaTideHeight: 1,
//   invisibleMoonPeriod: 270,
//   invisibleMoonNewMoonTime: 120,
//   invisibleMoonManaTideHeight: 1,
//   // moscowTime: 0,
// };

const manaOceanSettingsDataSchema: JSONSchemaType<ManaOceanSettingsData> = {
  type: "object",
  properties: {
    minManaLevel: {type: "integer"},
    neutralManaLevel: {type: "integer"},
    maxManaLevel: {type: "integer"},
    visibleMoonPeriod: {type: "integer"},
    visibleMoonNewMoonTime: {type: "integer"},
    visibleMoonManaTideHeight: {type: "integer"},
    invisibleMoonPeriod: {type: "integer"},
    invisibleMoonNewMoonTime: {type: "integer"},
    invisibleMoonManaTideHeight: {type: "integer"},
  },
  required: [
    "minManaLevel", 
    "neutralManaLevel", 
    "maxManaLevel", 
    "visibleMoonPeriod", 
    "visibleMoonNewMoonTime", 
    "visibleMoonManaTideHeight", 
    "invisibleMoonPeriod",
    "invisibleMoonNewMoonTime",
    "invisibleMoonManaTideHeight",
  ],
  // additionalProperties: false,
};

export const validateManaOceanSettingsData = ajv.compile(manaOceanSettingsDataSchema);


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

// export const manaOceanEffectSettings: ManaOceanEffectSettingsData = {
//   massacreDelay: 60000 * 15,
//   massacreDuration: 60000 * 30,
//   // massacreDelay: 15000,
//   // massacreDuration: 15000,
//   // massacreDuration: 105000,
//   powerSpellBoundary: 7,
//   powerSpellDelay: 60000 * 15,
//   powerSpellDuration: 60000 * 15,
//   // powerSpellDelay: 15000,
//   // powerSpellDuration: 15000,
//   // powerSpellDuration: 105000,
//   ritualMembersBoundary: 2,
//   ritualDelay: 60000 * 15,
//   // ritualDelay: 15000,
//   spellDurationItem: 60000,
//   // spellDurationItem: 6000,
//   spellProbabilityPerPower: 20,
//   spellDurationPerPower: 3,
// };

const manaOceanEffectSettingsDataSchema: JSONSchemaType<ManaOceanEffectSettingsData> = {
  type: "object",
  properties: {
    massacreDelay: {type: "integer"},
    massacreDuration: {type: "integer"},
    powerSpellBoundary: {type: "integer"},
    powerSpellDelay: {type: "integer"},
    powerSpellDuration: {type: "integer"},
    ritualMembersBoundary: {type: "integer"},
    ritualDelay: {type: "integer"},
    spellDurationItem: {type: "integer"},
    spellProbabilityPerPower: {type: "integer"},
    spellDurationPerPower: {type: "integer"},
  },
  required: [
    "massacreDelay", 
    "massacreDuration", 
    "powerSpellBoundary", 
    "powerSpellDelay", 
    "powerSpellDuration", 
    "ritualMembersBoundary", 
    "ritualDelay",
    "spellDurationItem",
    "spellProbabilityPerPower",
    "spellDurationPerPower",
  ],
  // additionalProperties: false,
};

export const validateManaOceanEffectSettingsData = ajv.compile(manaOceanEffectSettingsDataSchema);

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