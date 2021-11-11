import { ManaOceanEffectSettingsData } from "./manaOceanEffectSettingsData";
import { ManaOceanSettingsData } from "./manaOceanSettingsData";

export interface SettingsCatalog {
  manaOcean?: ManaOceanSettingsData;
  manaOceanEffects?: ManaOceanEffectSettingsData
};

export type SettingsKeys = keyof SettingsCatalog;

export type SettingsValues = 
  ManaOceanSettingsData | 
  ManaOceanEffectSettingsData;