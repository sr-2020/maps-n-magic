import { 
  Metadata, 
  TypeOnly,
  Typed,
  ServiceContract,
  ServiceContractTypes
} from '../../core';

import { 
  SettingsCatalog,
  SettingsKeys,
  SettingsValues,
  ManaOceanSettingsData,
  ManaOceanEffectSettingsData,
} from "../../domain";

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

export interface SettingsServiceContract extends ServiceContract {
  Request: GetSettings | GetSettingsCatalog;
  Action: PostSettings | PostSettingsConfirmed | SetSettings;
  EmitEvent: SettingsEvents;
  ListenEvent: never;
  NeedAction: never;
  NeedRequest: never;
}

export const ssMetadata: ServiceContractTypes<SettingsServiceContract> = {
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
    // 'setSettingsCatalog',
  ],
  listenEvents: [],
  needActions: [],
  needRequests: [],
};