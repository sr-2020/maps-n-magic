export interface SoundSettings {
  rotationTimeout: number;
  rotationSoundTimeout: number;
  backgroundVolume: number;
  rotationVolume: number;
}

export interface TrackData {
  key: string | number;
  name: string;
  volumePercent: number; // 0-100
}

export interface Rotation {
  key: string | number;
  tracks: TrackData[],
}

export interface SoundStageState {
  backgroundSound: TrackData | null;
  rotationSounds: Rotation | null;
}

export interface SoundStageData extends SoundSettings, SoundStageState {
}