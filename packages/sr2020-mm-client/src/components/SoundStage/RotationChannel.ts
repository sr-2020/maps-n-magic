import * as R from 'ramda';

import { shuffle } from "sr2020-mm-event-engine";
import { SoundCtl } from "../../types";
import { SoundStage } from "./SoundStage";
import { PlaylistItem } from "./types";
import { ctlStart, ctlStop } from "./utils";

const ROTATION_SILENCE_DURATION_MILLIS = 5000;


let counter = 1;

export class RotationChannel {
  soundCtl: SoundCtl | null = null;

  rotationSilenceTimeoutId: NodeJS.Timeout | null = null;

  index: number = -1;

  playlist: PlaylistItem[] = [];

  uid: number;

  disposed: boolean = false;

  constructor(private context: SoundStage) {
    this.uid = counter;
    counter++;
    this.playSound = this.playSound.bind(this);
  }

  run() {
    if (this.disposed) return;
    console.log(`${this.uid} RotationChannel.run`);
    const { rotationSounds } = this.context.soundStageState;
    const { soundSettings } = this.context.props;
    if (rotationSounds.length === 0) {
      this.rotationSilenceTimeoutId = setTimeout(() => this.run(), ROTATION_SILENCE_DURATION_MILLIS);
      return;
    }
    const soundSequence = R.intersperse(null, shuffle(rotationSounds));
    console.log(this.uid, 'soundSequence', soundSequence);

    this.playlist = soundSequence.map(el => {
      if (el === null) {
        return {
          type: 'silence',
          durationMillis: soundSettings.rotationTimeout
        }
      } else {
        return { type: 'sound', name: el };
      }
    });
    this.playlist.push({
      type: 'silence',
      durationMillis: soundSettings.rotationSoundTimeout
    });
    this.index = 0;
    this.playSound();
  }

  playSound() {
    console.log(`${this.uid} RotationChannel.playSound`);
    if (this.index >= this.playlist.length) {
      console.log(`${this.uid} rotation ended, run again`);
      this.run();
      return;
    }
    const playlistItem = this.playlist[this.index];
    if (playlistItem.type === 'silence') {
      console.log(`${this.uid}: index ${this.index}, start rotation silence,  duration ${playlistItem.durationMillis}`);
      this.index++;
      this.rotationSilenceTimeoutId = setTimeout(() => this.playSound(), playlistItem.durationMillis);
      return;
    }
    const { soundStorage, audioContextWrapper } = this.context.props;
    const sound = soundStorage.getSound(playlistItem.name);
    if ( sound === undefined ) {
      console.warn(`${this.uid}: index ${this.index},  rotation sound not found: ${playlistItem.name}, use default silence ${ROTATION_SILENCE_DURATION_MILLIS}`);
      this.rotationSilenceTimeoutId = setTimeout(() => this.playSound(), ROTATION_SILENCE_DURATION_MILLIS);
    } else {
      console.log(`${this.uid}: index ${this.index},  start rotation sound ${sound.name}`);
      const ctl = audioContextWrapper.createSource(sound.buffer);
      this.soundCtl = ctl;
      ctl.source.addEventListener('ended', this.playSound);
      ctl.source.customData = { soundName: sound.name };
      ctl.gainNode.gain.value = 0.5; // 50 / 100
      ctlStart(ctl);
    }
    this.index++;
  }

  dispose() {
    console.log(`${this.uid} RotationChannel.dispose`);
    if (this.rotationSilenceTimeoutId !== null) {
      clearTimeout(this.rotationSilenceTimeoutId);
    }
    if (this.soundCtl) {
      ctlStop(this.soundCtl);
      this.soundCtl = null;
    }
    this.disposed = true;
  }
}