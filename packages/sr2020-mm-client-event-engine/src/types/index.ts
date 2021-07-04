import { TrackData } from "sr2020-mm-event-engine";

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

export type SoundChannel = {
  [name: string]: SoundCtl
};

export interface SoundItem extends TrackData {
  type: 'sound';
}

export interface SilenceItem {
  type: 'silence';
  durationMillis: number;
}

export type PlaylistItem = SoundItem | SilenceItem;