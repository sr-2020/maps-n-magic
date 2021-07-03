import { TrackData } from "sr2020-mm-event-engine";
import { SoundCtl } from "../../types";

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