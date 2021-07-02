export * from './Beacon';
export * from './BgImageOverlay';
export * from './BgRectangle';
export * from './BgTitleOverlay';
export * from './LocationCentroid';
export * from './LocNeighborLine';
export * from './ManaOceanLocation';
export * from './BasicLocation';
export * from './loginState';

interface CommonSoundInfo {
  name: string;
}

interface UnloadedSound extends CommonSoundInfo {
  status: 'unloaded';
}
interface LoadingSound extends CommonSoundInfo {
  status: 'loading';
}
interface LoadedSound extends CommonSoundInfo {
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

