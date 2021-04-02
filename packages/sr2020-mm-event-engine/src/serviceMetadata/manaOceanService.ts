import { 
  Metadata,
  LocationRecordOptions,
  Typed,
  TypeOnly,
  SpellCast,
  TypeObjectOnly
} from '../index';

export interface LocationUpdate {
  id: number;
  body: {
    options: LocationRecordOptions
  }
}

export const moMetadata: Metadata = {
  actions: [
    'spellCast',
    'wipeManaOceanEffects',
    'removeManaEffect',
    'addManaEffect',
  ],
  requests: [],
  emitEvents: [],
  needActions: [
    'putLocationRecord',
    'putLocationRecords',
    'pushNotification',
  ],
  needRequests: [
    'settings',
    'locationRecords',
    'locationRecord',
    'enableManaOcean',
    'neighborOrRandomLocation',
    'neighborList',
  ],
  listenEvents: ['massacreTriggered'],
};

// requests

// actions

export type SpellCastAction = Typed<'spellCast', {
  data: SpellCast
}>;

export type WipeManaOceanEffects = TypeOnly<'wipeManaOceanEffects'>;

export type RemoveManaEffect = Typed<'removeManaEffect', {
  locationId: number,
  effectId: string
}>;

export type AddManaEffect = Typed<'addManaEffect', {
  locationId: number,
  effectType: 'massacre' | 'powerSpell'
}>;

// events

export type EWipeManaOceanEffects = TypeObjectOnly<'wipeManaOceanEffects'>;

export type EAddManaEffect = Typed<'addManaEffect', {
  locationId: number,
  effectType: 'massacre' | 'powerSpell'
}>;

export type ERemoveManaEffect = Typed<'removeManaEffect', {
  locationId: number,
  effectId: string
}>;

export type ManaOceanStubEvents = 
  EWipeManaOceanEffects |
  EAddManaEffect |
  ERemoveManaEffect;
