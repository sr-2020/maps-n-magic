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
  listenEvents: [
    'massacreTriggered',
    'spellCast',
    'wipeManaOceanEffects',
    'removeManaEffect',
    'addManaEffect',
  ],
};

// requests

// actions

// events

export type EWipeManaOceanEffects = TypeObjectOnly<'wipeManaOceanEffects'>;

export type ESpellCast = Typed<'spellCast', {
  data: SpellCast
}>;

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
