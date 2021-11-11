import Ajv, { JSONSchemaType } from "ajv";
import { SettingsData } from "../shared-kernel";

const ajv = new Ajv({
  allErrors: true,
  // removeAdditional: true,
  // useDefaults: true
});

export interface ManaOceanEffectSettingsData extends SettingsData {
  massacreDelay: number;
  massacreDuration: number;
  massacreManaChange: number;
  massacrePeopleLimit: number;
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
    massacreManaChange: {type: "integer"},
    massacrePeopleLimit: {type: "integer"},
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
    "massacreManaChange",
    "massacrePeopleLimit",
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


export const manaOceanEffectSettings: ManaOceanEffectSettingsData = {
  massacreDelay: 60000 * 15,
  massacreDuration: 60000 * 30,
  massacreManaChange: 1,
  massacrePeopleLimit: 5,
  // massacreDelay: 15000,
  // massacreDuration: 15000,
  // massacreDuration: 105000,
  powerSpellBoundary: 7,
  powerSpellDelay: 60000 * 15,
  powerSpellDuration: 60000 * 15,
  // powerSpellDelay: 15000,
  // powerSpellDuration: 15000,
  // powerSpellDuration: 105000,
  ritualMembersBoundary: 2,
  ritualDelay: 60000 * 15,
  // ritualDelay: 15000,
  spellDurationItem: 60000,
  // spellDurationItem: 6000,
  spellProbabilityPerPower: 20,
  spellDurationPerPower: 3,
};
