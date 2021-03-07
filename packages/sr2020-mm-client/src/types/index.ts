export * from './Beacon';
export * from './BgImageOverlay';
export * from './BgRectangle';
export * from './BgTitleOverlay';
export * from './LocationCentroid';
export * from './LocNeighborLine';
export * from './ManaOceanLocation';
export * from './BasicLocation';

export interface Sound {
  name: string;
  hash: string;
  size: number;
  status: string;
  buffer?: AudioBuffer;
}

export interface SoundCtl {
  source: AudioBufferSourceNode & { 
    customData?: any, 
    noteOn?: any ,
    noteOff?: any
  };
  gainNode: GainNode
};

