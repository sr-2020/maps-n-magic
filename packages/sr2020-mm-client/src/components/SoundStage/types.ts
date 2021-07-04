import { SoundCtl } from "sr2020-mm-client-event-engine";
import { TrackData } from "sr2020-mm-event-engine";

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