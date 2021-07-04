
interface CommonSoundInfo {
  name: string;
}

export interface UnloadedSound extends CommonSoundInfo {
  status: 'unloaded';
}
export interface LoadingSound extends CommonSoundInfo {
  status: 'loading';
}
export interface LoadedSound extends CommonSoundInfo {
  status: 'loaded';
  buffer: AudioBuffer;
}

export type Sound = 
  | UnloadedSound
  | LoadedSound
  | LoadingSound
;

export interface SoundCtl {
  source: AudioBufferSourceNode & { 
    customData?: any, 
    noteOn?: any ,
    noteOff?: any
  };
  gainNode: GainNode
};

