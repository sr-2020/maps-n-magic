export interface SoundStageData {
  backgroundSound: string;
  rotationSounds: string[];
  rotationTimeout: number;
  rotationSoundTimeout: number;
  backgroundVolume: number;
  rotationVolume: number;
}

export interface BackgroundImage {
  latlngs: unknown[];
  image: string;
  id: number;
  name: string;
}