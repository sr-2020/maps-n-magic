import { 
  AbstractService, 
  Metadata, 
  GameModel, 
  GMLogger,
  SoundStageData,
  TypeOnly,
  Typed,
} from 'sr2020-mm-event-engine';

export const soundStageMetadata: Metadata = {
  requests: ['soundStage'],
  actions: [
    'setBackgroundSound',
    'rotationSoundsChange',
    'clearSoundStage',
    'setRotationTimeout',
    'setRotationSoundTimeout',
    'setRotationVolume',
    'setBackgroundVolume',
  ],
  emitEvents: [
    'backgroundSoundUpdate',
    'rotationSoundsUpdate',
    'rotationTimeoutUpdate',
    'rotationSoundTimeoutUpdate',
    'backgroundVolumeUpdate',
    'rotationVolumeUpdate',
  ],
  needActions: [],
  needRequests: [],
  listenEvents: []
};

// requests

export type GetSoundStage = (arg: TypeOnly<'soundStage'>) => SoundStageData;

// actions

export type SetBackgroundSound = Typed<'setBackgroundSound', {
  name: string;
}>;
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
export type ClearSoundStage = TypeOnly<'clearSoundStage'>;
export type RotationSoundsChange = Typed<'rotationSoundsChange', {
  added: string[];
  removed: string[];
}>;

// events

export type EBackgroundSoundUpdate = Typed<'backgroundSoundUpdate', {
  backgroundSound: string;
}>;
export type ERotationTimeoutUpdate = Typed<'rotationTimeoutUpdate', {
  rotationTimeout: number;
}>;
export type ERotationSoundTimeoutUpdate = Typed<'rotationSoundTimeoutUpdate', {
  rotationSoundTimeout: number;
}>;
export type EBackgroundVolumeUpdate = Typed<'backgroundVolumeUpdate', {
  backgroundVolume: number;
}>;
export type ERotationVolumeUpdate = Typed<'rotationVolumeUpdate', {
  rotationVolume: number;
}>;
export type ERotationSoundsUpdate = Typed<'rotationSoundsUpdate', {
  rotationSounds: string[];
}>;

export type SoundStageEvents = 
  EBackgroundSoundUpdate |
  ERotationTimeoutUpdate |
  ERotationSoundTimeoutUpdate |
  EBackgroundVolumeUpdate |
  ERotationVolumeUpdate |
  ERotationSoundsUpdate;