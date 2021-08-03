import * as R from 'ramda';

import { shuffle, SoundSettings, SoundStageState } from "sr2020-mm-event-engine";
import { PlaylistItem, SoundCtl } from '../types';
import { AudioContextWrapper } from './AudioContextWrapper';
import { ctlStart, ctlStop } from './ctlUtils';
import { SoundStorage } from './SoundStorage';

const ROTATION_SILENCE_DURATION_MILLIS = 5000;

let counter = 1;

interface RotationChannelContext {
  soundStageState: SoundStageState;
  props: {
    soundSettings: SoundSettings;
    soundStorage: SoundStorage;
    audioContextWrapper: AudioContextWrapper;
  },
  setCurRotationSoundData: (data: string) => void;
}

export class RotationChannel {
  soundCtl: SoundCtl | null = null;

  rotationSilenceTimeoutId: NodeJS.Timeout | null = null;

  index: number = -1;

  playlist: PlaylistItem[] = [];

  uid: number;

  disposed: boolean = false;

  mute: boolean = false;

  constructor(private context: RotationChannelContext) {
    this.uid = counter;
    counter++;
    this.playSound = this.playSound.bind(this);
  }

  setMute (mute: boolean): void {
    this.mute = mute;
    if (this.soundCtl === null) {
      return;
    }
    if (mute) {
      this.soundCtl.gainNode.gain.value = 0;
    } else {
      this.soundCtl.gainNode.gain.value = this.soundCtl.originalVolumePercent / 100;
    }
  }

  run() {
    if (this.disposed) return;
    // console.log(`${this.uid} RotationChannel.run`);
    const { rotationSounds } = this.context.soundStageState;
    const { soundSettings } = this.context.props;
    if (rotationSounds === null || rotationSounds.tracks.length === 0) {
      this.rotationSilenceTimeoutId = setTimeout(() => this.run(), ROTATION_SILENCE_DURATION_MILLIS);
      return;
    }
    const soundSequence = R.intersperse(null, shuffle(rotationSounds.tracks));
    // console.log(this.uid, 'soundSequence', soundSequence);

    this.playlist = soundSequence.map((el): PlaylistItem => {
      if (el === null) {
        return {
          type: 'silence',
          durationMillis: soundSettings.rotationTimeout
        }
      } else {
        return { type: 'sound', ...el };
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
    // console.log(`${this.uid} RotationChannel.playSound`);
    if (this.index >= this.playlist.length) {
      // console.log(`${this.uid} rotation ended, run again`);
      this.run();
      return;
    }
    const playlistItem = this.playlist[this.index];
    if (playlistItem.type === 'silence') {
      // console.log(`${this.uid}: index ${this.index}, start rotation silence,  duration ${playlistItem.durationMillis}`);
      this.soundCtl = null;
      this.rotationSilenceTimeoutId = setTimeout(() => this.playSound(), playlistItem.durationMillis);
      this.context.setCurRotationSoundData(JSON.stringify({
        index: this.index,
        playlistLength: this.playlist.length,
        type: 'silence', 
        durationMillis: playlistItem.durationMillis
      }, null, '  '));
      this.index++;
      return;
    }
    const { soundStorage, audioContextWrapper } = this.context.props;
    const sound = soundStorage.getSound(playlistItem.name);
    if ( sound === undefined ) {
      // console.warn(`${this.uid}: index ${this.index}, rotation sound not found: ${playlistItem.name}, use default silence ${ROTATION_SILENCE_DURATION_MILLIS}`);
      this.soundCtl = null;
      this.rotationSilenceTimeoutId = setTimeout(() => this.playSound(), ROTATION_SILENCE_DURATION_MILLIS);
      this.context.setCurRotationSoundData(JSON.stringify({
        index: this.index,
        playlistLength: this.playlist.length,
        type: 'silence', 
        durationMillis: ROTATION_SILENCE_DURATION_MILLIS
      }, null, '  '));
    } else {
      // console.log(`${this.uid}: index ${this.index}, start rotation sound ${JSON.stringify(playlistItem)}`);
      const ctl = audioContextWrapper.createSource(sound.buffer);
      this.soundCtl = ctl;
      ctl.source.addEventListener('ended', this.playSound);
      ctl.source.customData = { soundName: sound.name };
      if (this.mute) {
        ctl.gainNode.gain.value = 0;
      } else {
        ctl.gainNode.gain.value = playlistItem.volumePercent / 100;
      }
      this.soundCtl.originalVolumePercent = playlistItem.volumePercent;
      // ctl.gainNode.gain.value = 0;
      ctlStart(ctl);
      this.context.setCurRotationSoundData(JSON.stringify({
        index: this.index,
        playlistLength: this.playlist.length,
        type: 'sound', 
        name: sound.name,
        volumePercent: playlistItem.volumePercent,
        durationMillis: Math.round(sound.buffer.duration * 1000)
      }, null, '  '));
    }
    this.index++;
  }

  smoothEndRotation() {
    if (this.soundCtl === null ) { // silence case - run next rotation right after silence
      this.index = this.playlist.length;
    } else { // sound case - play final rotation silence and start new rotation
      this.index = this.playlist.length - 1;
    }
  }

  dispose() {
    // console.log(`${this.uid} RotationChannel.dispose`);
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