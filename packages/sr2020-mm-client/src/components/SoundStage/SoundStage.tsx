import React from 'react';
import './SoundStage.css';
import * as R from 'ramda';

import { AudioContextWrapper } from '../../utils/AudioContextWrapper';
import { SoundStorage } from '../../utils';
import { shuffle, SoundSettings, SoundStageState } from 'sr2020-mm-event-engine';

import { Sound, SoundCtl } from "../../types";

interface SoundStageProps {
  audioContextWrapper: AudioContextWrapper;
  soundStorage: SoundStorage;
  soundStageState: SoundStageState;
  soundSettings: SoundSettings;
}



type SoundChannel = {
  [name: string]: SoundCtl
};

const BG_SILENCE_DURATION_MILLIS = 5000;
const ROTATION_SILENCE_DURATION_MILLIS = 5000;

// Web Audio API was done in prefixed webkitAudioContext and standard
// leave for compatibility
function ctlStart(ctl: SoundCtl): void {
  if (!ctl.source.start) {
    ctl.source.noteOn(0);
  } else {
    ctl.source.start(0);
  }
}

// Web Audio API was done in prefixed webkitAudioContext and standard
// leave for compatibility
function ctlStop(ctl: SoundCtl): void {
  if (!ctl.source.stop) {
    ctl.source.noteOff(0);
  } else {
    ctl.source.stop(0);
  }
}

interface SoundItem {
  type: 'sound';
  name: string;
}

interface SilenceItem {
  type: 'silence';
  durationMillis: number;
}

type PlaylistItem = SoundItem | SilenceItem;

let counter = 1;

class RotationChannel {
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
    // const { rotationSounds } = this.context.soundStageState;
    const { soundSettings } = this.context.props;
    const rotationSounds: string[] = [
      // 'spirit_barguzin_2.mp3',
      // 'spirit_kultuk_3.mp3',
      // 'spirit_sarma_4.mp3',
    ];
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

export class SoundStage extends React.Component<SoundStageProps> {
  soundStageState: SoundStageState = {
    backgroundSound: null,
    rotationSounds: []
  };

  backgroundChannel: SoundChannel = {};

  rotationChannel: RotationChannel;

  bgSilenceTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: SoundStageProps) {
    super(props);
    this.rotationChannel = new RotationChannel(this);
    this.onBackgroundSoundEnded = this.onBackgroundSoundEnded.bind(this);
  }

  componentDidMount() {
    const { soundStageState, soundStorage, soundSettings } = this.props;
    this.soundStageState = R.clone(soundStageState);
    // this.soundStageState.backgroundSound = 'spirit_sarma_4.mp3';
    // this.playBgSound();
    // this.rotationChannel.run();
    // setInterval(() => {
    //   if (this.soundStageState.backgroundSound) {
    //     this.soundStageState.backgroundSound = null;
    //   } else {
    //     this.soundStageState.backgroundSound = 'spirit_sarma_4.mp3';
    //   }
    // }, 1200);
    // this.soundStageState.backgroundSound = 'manaLevel_4.mp3';
  }

  componentWillUnmount() {
    if (this.bgSilenceTimeoutId !== null) {
      clearTimeout(this.bgSilenceTimeoutId);
    }
    this.rotationChannel.dispose();
  }
  
  playBgSound() {
    console.log(`playBgSound ${this.soundStageState.backgroundSound}`);
    const { soundStageState, soundStorage, soundSettings } = this.props;
    if (this.soundStageState.backgroundSound === null) {
      this.bgSilenceTimeoutId = setTimeout(() => this.playBgSound(), BG_SILENCE_DURATION_MILLIS);
    } else {
      const sound = soundStorage.getSound(this.soundStageState.backgroundSound);
      if ( sound === undefined ) {
        console.warn(`Sound not found: ${this.soundStageState.backgroundSound}`);
        this.bgSilenceTimeoutId = setTimeout(() => this.playBgSound(), BG_SILENCE_DURATION_MILLIS);
      } else {
        console.log(`start bg sound ${sound.name}`);
        this.addSoundToChannel(
          this.backgroundChannel, 
          sound.name, 
          sound.buffer, 
          soundSettings.backgroundVolume / 100, 
          this.onBackgroundSoundEnded
          // true
        );
      }
    }
  }

  onBackgroundSoundEnded(ev: Event) {
    const entries = Object.entries(this.backgroundChannel);
    if (entries.length !== 1) {
      console.error(`background channel sound number is invalid: ${entries.length}`);
      return;
    }
    this.playBgSound();
    // const [name, ctl] = entries[0];
    // if (name === this.soundStageState.backgroundSound) {
    //   console.log(`repeat bg sound ${name}`);
    //   this.ctlStart(ctl);
    // } else {

    // }
  }

  addSoundToChannel(
    collection: SoundChannel, 
    soundName: string, 
    buffer: AudioBuffer, 
    volume: number, 
    onSoundEnded: (ev: Event) => void
    // loop: boolean = false
  ): void {
    // clean current sound if it exists
    const existingCtl: SoundCtl | undefined = collection[soundName];
    if (existingCtl !== undefined) {
      this.removeSoundFromChannel(collection, soundName);
    }

    // create and start sound
    const { audioContextWrapper } = this.props;
    const ctl = audioContextWrapper.createSource(buffer);
    collection[soundName] = ctl;
    // ctl.source.loop = loop;
    // if (!loop) {
    ctl.source.addEventListener('ended', onSoundEnded);
      // ctl.source.onended = this.onSoundEnded(collection);
    // }
    ctl.source.customData = { soundName };
    // ctl.gainNode.gain.value = 0;
    ctl.gainNode.gain.value = volume;
    ctlStart(ctl);
    // }
  }

  removeSoundFromChannel(collection: SoundChannel, soundName: string): void {
    const ctl = collection[soundName];
    if (!ctl) return;
    ctlStop(ctl);
    delete collection[soundName];
  }



  render () {
    return null;
    // const { soundSettings, soundStageState, audioContextWrapper, soundStorage } = this.props;
  
    // return (
    //   <div className="SoundStage">
    //     SoundStage content
    //   </div>
    // );
  }
}




