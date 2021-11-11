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

export type SetRotationTimeout = (arg: Typed<'setRotationTimeout', {
  rotationTimeout: number;
}>) => void;
export type SetRotationSoundTimeout = (arg: Typed<'setRotationSoundTimeout', {
  rotationSoundTimeout: number;
}>) => void;
export type SetBackgroundVolume = (arg: Typed<'setBackgroundVolume', {
  backgroundVolume: number;
}>) => void;
export type SetRotationVolume = (arg: Typed<'setRotationVolume', {
  rotationVolume: number;
}>) => void;

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