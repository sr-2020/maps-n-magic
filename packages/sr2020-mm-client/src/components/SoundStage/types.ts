import { SoundCtl } from "../../types";

export type SoundChannel = {
  [name: string]: SoundCtl
};

export interface SoundItem {
  type: 'sound';
  name: string;
}

export interface SilenceItem {
  type: 'silence';
  durationMillis: number;
}

export type PlaylistItem = SoundItem | SilenceItem;