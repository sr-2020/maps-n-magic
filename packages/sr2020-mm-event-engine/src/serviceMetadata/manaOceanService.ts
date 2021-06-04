import { 
  Metadata,
  LocationRecordOptions,
  Typed,
  TypeOnly,
  SpellCast,
  TypeObjectOnly,
  ServiceContract,
  ServiceContractTypes,
  PutLocationRecord,
  PutLocationRecords,
  PushNotification,
  GetSettings,
  GetLocationRecord,
  GetLocationRecords,
  GetEnableManaOcean,
  GetNeighborOrRandomLocation,
  GetNeighborList
} from '../index';

export interface LocationUpdate {
  id: number;
  body: {
    options: LocationRecordOptions
  }
}



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

export type EMassacreTriggered = Typed<'massacreTriggered', {
  locationId,
  timestamp,
}>;

export type ManaOceanListenEvent = 
  | EMassacreTriggered
  | ESpellCast
  | EAddManaEffect
  | ERemoveManaEffect
  | EWipeManaOceanEffects
;

export interface ManaOceanServiceContract extends ServiceContract {
  Request: never;
  Action: never;
  EmitEvent: never;
  ListenEvent: ManaOceanListenEvent;
  NeedAction: 
    | PutLocationRecord
    | PutLocationRecords
    | PushNotification;
  NeedRequest: 
    | GetSettings
    | GetLocationRecord
    | GetLocationRecords
    | GetEnableManaOcean
    | GetNeighborOrRandomLocation
    | GetNeighborList;
}

export const moMetadata: ServiceContractTypes<ManaOceanServiceContract> = {
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