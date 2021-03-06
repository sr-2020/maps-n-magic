/* eslint-disable class-methods-use-this */
// eslint-disable-next-line max-classes-per-file
import * as R from 'ramda';
import { EventEmitter } from 'events';

import { shuffle } from 'sr2020-mm-event-engine';
import { SoundStageData } from 'sr2020-mm-client-event-engine/types';
import { AudioContextWrapper } from '../../utils/AudioContextWrapper';

import { Sound, SoundCtl } from "../../types";

type SoundCollection = {
  [name: string]: SoundCtl
};

enum TimeoutType {
  'rotationTimeout',
  'rotationSoundTimeout'
};

export class SoundStage extends EventEmitter {
  context: AudioContextWrapper = null;

  backgroundSound: string | null = null;

  rotationSounds: string[] = [];

  // timeout between sounds in rotation
  rotationTimeout: number = null;

  // timeout between rotations
  rotationSoundTimeout: number = null;

  backgroundVolume: number = null;

  rotationVolume: number = null;

  // immediate rotation data

  playbackRotation: string[] = [];

  backgroundSources: SoundCollection = {};

  rotationSources: SoundCollection = {};

  currentTimeout: number | null = null;

  currentTimeoutType: TimeoutType = null;

  rotationTimeoutId: NodeJS.Timeout | null = null;

  gameModel: any = null;

  constructor(context: AudioContextWrapper) {
    super();
    this.context = context;
    this.onBackgroundSoundUpdate = this.onBackgroundSoundUpdate.bind(this);
    this.onRotationSoundsUpdate = this.onRotationSoundsUpdate.bind(this);
    this.onRotationTimeoutUpdate = this.onRotationTimeoutUpdate.bind(this);
    this.onRotationSoundTimeoutUpdate = this.onRotationSoundTimeoutUpdate.bind(this);
    this.onBackgroundVolumeUpdate = this.onBackgroundVolumeUpdate.bind(this);
    this.onRotationVolumeUpdate = this.onRotationVolumeUpdate.bind(this);
    this.onSoundEnded = this.onSoundEnded.bind(this);
  }

  dispose(): void {
    if (this.gameModel) {
      this.subscribe('off', this.gameModel);
    }
    this.rotationSounds = [];
    // this.playbackRotation = [];
    this._setPlaybackRotation([]);
    this.stopAllSounds();
    clearTimeout(this.rotationTimeoutId);
  }

  subscribe(action, gameModel): void {
    gameModel[action]('backgroundSoundUpdate', this.onBackgroundSoundUpdate);
    gameModel[action]('rotationSoundsUpdate', this.onRotationSoundsUpdate);
    gameModel[action]('rotationTimeoutUpdate', this.onRotationTimeoutUpdate);
    gameModel[action]('rotationSoundTimeoutUpdate', this.onRotationSoundTimeoutUpdate);
    gameModel[action]('backgroundVolumeUpdate', this.onBackgroundVolumeUpdate);
    gameModel[action]('rotationVolumeUpdate', this.onRotationVolumeUpdate);
  }

  subscribeOnModel(gameModel): void {
    if (this.gameModel !== gameModel) {
      if (this.gameModel) {
        this.subscribe('off', this.gameModel);
      }
      this.gameModel = gameModel;
      this.initialize();
    }
  }

  initialize(): void {
    const soundStage: SoundStageData = this.gameModel.get('soundStage');
    this.onBackgroundSoundUpdate(soundStage);
    this.onRotationSoundsUpdate(soundStage);
    this.onRotationTimeoutUpdate(soundStage);
    this.onRotationSoundTimeoutUpdate(soundStage);
    this.onBackgroundVolumeUpdate(soundStage);
    this.onRotationVolumeUpdate(soundStage);
    // this.backgroundSound = soundStage.backgroundSound;
    // this.rotationSounds = [...soundStage.rotationSounds];
    this.subscribe('on', this.gameModel);
    console.log('SoundStage initialize');
  }

  onBackgroundSoundUpdate({ backgroundSound }: SoundStageData): void {
    if (this.backgroundSound === backgroundSound) {
      return;
    }
    if (this.backgroundSound) {
      this.stopSound(this.backgroundSources, this.backgroundSound);
    }
    this.backgroundSound = backgroundSound;
    if (this.backgroundSound) {
      const sound = this.gameModel.get({
        type: 'sound',
        name: this.backgroundSound,
      });
      if (sound) {
        this.startSound(this.backgroundSources, this.backgroundSound, sound.buffer, this.backgroundVolume / 100, true);
      } else {
        console.warn(`Sound not found: ${this.backgroundSound}`);
      }
    }
    console.log('SoundStage onBackgroundSoundUpdate');
  }

  onRotationSoundsUpdate({ rotationSounds }: SoundStageData): void {
    if (R.symmetricDifference(this.rotationSounds, rotationSounds).length === 0) {
      return;
    }
    this.rotationSounds = [...rotationSounds];
    if (this.playbackRotation.length === 0 && this.rotationSounds.length > 0) {
      this.generateAndStartRotation();
    }
    console.log('SoundStage onRotationSoundsUpdate');
  }

  onRotationTimeoutUpdate({ rotationTimeout }: SoundStageData): void {
    this.rotationTimeout = rotationTimeout;
  }

  onRotationSoundTimeoutUpdate({ rotationSoundTimeout }: SoundStageData): void {
    this.rotationSoundTimeout = rotationSoundTimeout;
  }

  onBackgroundVolumeUpdate({ backgroundVolume }: SoundStageData): void {
    this.backgroundVolume = backgroundVolume;
    Object.values(this.backgroundSources).forEach((ctl) => (ctl.gainNode.gain.value = backgroundVolume / 100));
  }

  onRotationVolumeUpdate({ rotationVolume }: SoundStageData): void {
    this.rotationVolume = rotationVolume;
    Object.values(this.rotationSources).forEach((ctl) => (ctl.gainNode.gain.value = rotationVolume / 100));
  }

  generateAndStartRotation(): void {
    // console.log('generateAndStartRotation');
    if (this.rotationSounds.length === 0 || this.rotationTimeoutId !== null) {
      return;
    }
    this._setPlaybackRotation(shuffle([...this.rotationSounds]));
    this.startRotationSound();
  }

  _setPlaybackRotation(playbackRotation: string[]): void {
    this.playbackRotation = playbackRotation;
    this.emit('playbackRotationUpdate', {
      playbackRotation: this.playbackRotation,
    });
    console.log('playbackRotation', this.playbackRotation);
  }

  getPlaybackRotation(): string[] {
    return [...this.playbackRotation];
  }

  startRotationSound(): void {
    // console.log('startRotationSound');
    const sound: Sound = this.gameModel.get({
      type: 'sound',
      name: this.playbackRotation[0],
    });
    console.log('start', this.playbackRotation[0]);
    this.startSound(this.rotationSources, this.playbackRotation[0], sound.buffer, this.rotationVolume / 100);
  }

  onSoundEnded(collection: SoundCollection) {
    return (e) => {
      // console.log('onSoundEnded');
      this.stopSound(collection, e.target.customData.soundName);
      this._setPlaybackRotation(R.tail(this.playbackRotation));
      if (this.playbackRotation.length > 0) {
        console.log('startTimeout');
        this.rotationTimeoutId = setTimeout(() => {
          this.startRotationSound();
          this.setCurrentTimeout(null, null);
        }, this.rotationTimeout);
        this.setCurrentTimeout(this.rotationTimeout, TimeoutType.rotationTimeout);
      } else if (this.rotationSounds.length > 0) {
        console.log('startTimeout');
        this.rotationTimeoutId = setTimeout(() => {
          this.rotationTimeoutId = null;
          this.generateAndStartRotation();
          this.setCurrentTimeout(null, null);
        }, this.rotationSoundTimeout);
        this.setCurrentTimeout(this.rotationSoundTimeout, TimeoutType.rotationSoundTimeout);
      } else {
        this.rotationTimeoutId = null;
      }
      // console.log('onSoundEnded', e);
    };
  }

  setCurrentTimeout(currentTimeout: number, currentTimeoutType: TimeoutType): void {
    this.currentTimeout = currentTimeout;
    this.currentTimeoutType = currentTimeoutType;
    this.emit('currentTimeoutUpdate', { currentTimeout, currentTimeoutType });
  }

  // playSingleSound(name, buffer) {
  //   this.stopAllSounds();
  //   this.startSound(name, buffer);
  // }

  // isPlayingSound(name) {
  //   return this.soundSources[name] !== undefined;
  // }

  stopAllSounds(): void {
    Object.keys(this.rotationSources).forEach((name) => this.stopSound(this.rotationSources, name));
    Object.keys(this.backgroundSources).forEach((name) => this.stopSound(this.backgroundSources, name));
  }

  stopSound(collection: SoundCollection, soundName: string): void {
    const ctl = collection[soundName];
    if (!ctl) return;
    if (!ctl.source.stop) {
      ctl.source.noteOff(0);
    } else {
      ctl.source.stop(0);
    }
    delete collection[soundName];
  }

  startSound(collection: SoundCollection, soundName: string, buffer: AudioBuffer, volume: number, loop: boolean = false): void {
    let ctl = collection[soundName];
    if (ctl) {
      this.stopSound(collection, soundName);
      ctl = null;
    }
    if (!ctl) {
      ctl = this.context.createSource(buffer);
      collection[soundName] = ctl;
      ctl.source.loop = loop;
      if (!loop) {
        ctl.source.onended = this.onSoundEnded(collection);
      }
      ctl.source.customData = { soundName };
      // ctl.gainNode.gain.value = 0;
      ctl.gainNode.gain.value = volume;
      if (!ctl.source.start) {
        ctl.source.noteOn(0);
      } else {
        ctl.source.start(0);
      }
    }
  }
}
