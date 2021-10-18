import Ajv, { JSONSchemaType } from "ajv";
import { SettingsData } from "../shared-kernel";

const ajv = new Ajv({
  allErrors: true,
  // removeAdditional: true,
  // useDefaults: true
});

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

export const defaultManaOceanSettings: ManaOceanSettingsData = {
  minManaLevel: 1,
  neutralManaLevel: 4,
  maxManaLevel: 7,
  visibleMoonPeriod: 180, // minutes
  visibleMoonNewMoonTime: 0,
  visibleMoonManaTideHeight: 1,
  invisibleMoonPeriod: 270,
  invisibleMoonNewMoonTime: 120,
  invisibleMoonManaTideHeight: 1,
  // moscowTime: 0,
};