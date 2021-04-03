import { 
  Metadata, 
  TypeOnly,
  Typed,
} from '../../core';

import { 
  SettingsCatalog,
  SettingsKeys,
  SettingsData,
  SettingsValues,
  ManaOceanSettingsData,
  ManaOceanEffectSettingsData,
} from "../../types";

export const ssMetadata: Metadata = {
  actions: [
    'postSettings',
    'postSettingsConfirmed',
    'setSettings',
    // 'setSettingsCatalog',
  ],
  requests: [
    'settingsCatalog',
    'settings',
  ],
  emitEvents: [
    'postSettings',
    'postSettingsRequested',
    'settingsChanged',
    'setSettingsCatalog',
  ],
  listenEvents: [],
  needActions: [],
  needRequests: [],
};

// requests

export type GetSettingsCatalog = (arg: TypeOnly<'settingsCatalog'>) => SettingsCatalog;
export type GetSettings = (arg: Typed<'settings', {
  name: SettingsKeys;
}>) => (SettingsValues | undefined);

// actions

export type PostSettingsArgs = {
  name: 'manaOcean';
  settings: ManaOceanSettingsData;
} | {
  name: 'manaOceanEffects';
  settings: ManaOceanEffectSettingsData;
};

export type PostSettings = Typed<'postSettings', PostSettingsArgs>;
export type PostSettingsConfirmed = Typed<'postSettingsConfirmed', PostSettingsArgs>;
export type SetSettings = Typed<'setSettings', PostSettingsArgs>;
export type SetSettingsCatalog = Typed<'setSettingsCatalog', {
  settingsCatalog: SettingsCatalog
}>;

// events

export type EPostSettingsRequested = Typed<'postSettingsRequested', PostSettingsArgs>;
export type EPostSettings = Typed<'postSettings', PostSettingsArgs>;
export type ESettingsChanged = Typed<'settingsChanged', {
  name: 'manaOcean' | 'manaOceanEffects';
  settingsCatalog: SettingsCatalog;
}>;
export type ESetSettingsCatalog = Typed<'setSettingsCatalog', {
  settingsCatalog: SettingsCatalog;
}>;

export type SettingsEvents = EPostSettingsRequested |
  EPostSettings |
  ESettingsChanged;
