import { 
  AbstractService, 
  Metadata, 
  GameModel, 
  GMLogger,
  SoundSettings,
  TypeOnly,
  Typed,
  ServiceContract,
  ServiceContractTypes,
  Req
} from 'sr2020-mm-event-engine';

// requests

export type GetSoundSettings = (arg: Typed<'soundSettings'>) => SoundSettings;

// actions

export type SetRotationTimeout = Typed<'setRotationTimeout', {
  rotationTimeout: number;
}>;
export type SetRotationSoundTimeout = Typed<'setRotationSoundTimeout', {
  rotationSoundTimeout: number;
}>;
export type SetBackgroundVolume = Typed<'setBackgroundVolume', {
  backgroundVolume: number;
}>;
export type SetRotationVolume = Typed<'setRotationVolume', {
  rotationVolume: number;
}>;

// events

export type ESoundSettingsChanged = Typed<'soundSettingsChanged', {
  soundSettings: SoundSettings;
}>;

export type SoundSettingsEvents = 
  | ESoundSettingsChanged
;

export interface SoundSettingsServiceContract extends ServiceContract {
  Request: GetSoundSettings;
  Action: 
    | SetRotationTimeout
    | SetRotationSoundTimeout
    | SetRotationVolume
    | SetBackgroundVolume;
  EmitEvent: SoundSettingsEvents;
  ListenEvent: never;
  NeedAction: never;
  NeedRequest: never;
}

export const soundSettingsMetadata: ServiceContractTypes<SoundSettingsServiceContract> = {
  requests: ['soundSettings'],
  actions: [
    'setRotationTimeout',
    'setRotationSoundTimeout',
    'setRotationVolume',
    'setBackgroundVolume',
  ],
  emitEvents: [
    'soundSettingsChanged'
  ],
  needActions: [],
  needRequests: [],
  listenEvents: []
};