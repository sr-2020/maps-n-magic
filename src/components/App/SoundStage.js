/* eslint-disable class-methods-use-this */
// eslint-disable-next-line max-classes-per-file
import * as R from 'ramda';
import { EventEmitter } from 'events';

import { shuffle } from '../../utils/miscUtils';

export class SoundStage extends EventEmitter {
  context = null;

  backgroundSound = null;

  rotationSounds = [];

  rotationTimeout = null;

  rotationSoundTimeout = null;

  // immediate rotation data

  playbackRotation = [];

  soundSources = {};

  currentTimeout = null;

  rotationTimeoutId = null;

  constructor(context) {
    super();
    this.context = context;
    this.onBackgroundSoundUpdate = this.onBackgroundSoundUpdate.bind(this);
    this.onRotationSoundsUpdate = this.onRotationSoundsUpdate.bind(this);
    this.onRotationTimeoutUpdate = this.onRotationTimeoutUpdate.bind(this);
    this.onRotationSoundTimeoutUpdate = this.onRotationSoundTimeoutUpdate.bind(this);
    this.onSoundEnded = this.onSoundEnded.bind(this);
  }

  dispose() {
    if (this.gameModel) {
      this.unsubscribe(this.gameModel);
    }
    this.rotationSounds = [];
    // this.playbackRotation = [];
    this._setPlaybackRotation([]);
    this.stopAllSounds();
    clearTimeout(this.rotationTimeoutId);
  }

  subscribe(gameModel) {
    gameModel.on('backgroundSoundUpdate', this.onBackgroundSoundUpdate);
    gameModel.on('rotationSoundsUpdate', this.onRotationSoundsUpdate);
    gameModel.on('rotationTimeoutUpdate', this.onRotationTimeoutUpdate);
    gameModel.on('rotationSoundTimeoutUpdate', this.onRotationSoundTimeoutUpdate);
  }

  unsubscribe(gameModel) {
    gameModel.off('backgroundSoundUpdate', this.onBackgroundSoundUpdate);
    gameModel.off('rotationSoundsUpdate', this.onRotationSoundsUpdate);
    gameModel.off('rotationTimeoutUpdate', this.onRotationTimeoutUpdate);
    gameModel.off('rotationSoundTimeoutUpdate', this.onRotationSoundTimeoutUpdate);
  }

  subscribeOnModel(gameModel) {
    if (this.gameModel !== gameModel) {
      if (this.gameModel) {
        this.unsubscribe(this.gameModel);
      }
      this.gameModel = gameModel;
      this.initialize();
    }
  }

  initialize() {
    const soundStage = this.gameModel.get('soundStage');
    this.onBackgroundSoundUpdate(soundStage);
    this.onRotationSoundsUpdate(soundStage);
    this.onRotationTimeoutUpdate(soundStage);
    this.onRotationSoundTimeoutUpdate(soundStage);
    // this.backgroundSound = soundStage.backgroundSound;
    // this.rotationSounds = [...soundStage.rotationSounds];
    this.subscribe(this.gameModel);
    console.log('SoundStage initialize');
  }

  onBackgroundSoundUpdate({ backgroundSound }) {
    if (this.backgroundSound === backgroundSound) {
      return;
    }
    if (this.backgroundSound) {
      this.stopSound(this.backgroundSound);
    }
    this.backgroundSound = backgroundSound;
    if (this.backgroundSound) {
      const sound = this.gameModel.get({
        type: 'sound',
        name: this.backgroundSound,
      });
      this.startSound(this.backgroundSound, sound.buffer, true);
    }
    console.log('SoundStage onBackgroundSoundUpdate');
  }

  onRotationSoundsUpdate({ rotationSounds }) {
    if (R.symmetricDifference(this.rotationSounds, rotationSounds).length === 0) {
      return;
    }
    this.rotationSounds = [...rotationSounds];
    if (this.playbackRotation.length === 0 && this.rotationSounds.length > 0) {
      this.generateAndStartRotation();
    }
    console.log('SoundStage onRotationSoundsUpdate');
  }

  onRotationTimeoutUpdate({ rotationTimeout }) {
    this.rotationTimeout = rotationTimeout;
  }

  onRotationSoundTimeoutUpdate({ rotationSoundTimeout }) {
    this.rotationSoundTimeout = rotationSoundTimeout;
  }

  generateAndStartRotation() {
    // console.log('generateAndStartRotation');
    if (this.rotationSounds.length === 0 || this.rotationTimeoutId !== null) {
      return;
    }
    this._setPlaybackRotation(shuffle([...this.rotationSounds]));
    this.startRotationSound();
  }

  _setPlaybackRotation(playbackRotation) {
    this.playbackRotation = playbackRotation;
    this.emit('playbackRotationUpdate', {
      playbackRotation: this.playbackRotation,
    });
    console.log('playbackRotation', this.playbackRotation);
  }

  getPlaybackRotation() {
    return [...this.playbackRotation];
  }

  startRotationSound() {
    // console.log('startRotationSound');
    const sound = this.gameModel.get({
      type: 'sound',
      name: this.playbackRotation[0],
    });
    console.log('start', this.playbackRotation[0]);
    this.startSound(this.playbackRotation[0], sound.buffer);
  }

  onSoundEnded(e) {
    // console.log('onSoundEnded');
    this.stopSound(e.target.customData.soundName);
    this._setPlaybackRotation(R.tail(this.playbackRotation));
    if (this.playbackRotation.length > 0) {
      console.log('startTimeout');
      this.rotationTimeoutId = setTimeout(() => {
        this.startRotationSound();
        this.setCurrentTimeout(null);
      }, this.rotationTimeout);
      this.setCurrentTimeout(this.rotationTimeout);
    } else if (this.rotationSounds.length > 0) {
      console.log('startTimeout');
      this.rotationTimeoutId = setTimeout(() => {
        this.rotationTimeoutId = null;
        this.generateAndStartRotation();
        this.setCurrentTimeout(null);
      }, this.rotationSoundTimeout);
      this.setCurrentTimeout(this.rotationSoundTimeout);
    } else {
      this.rotationTimeoutId = null;
    }
    // console.log('onSoundEnded', e);
  }

  setCurrentTimeout(currentTimeout) {
    this.currentTimeout = currentTimeout;
    this.emit('currentTimeoutUpdate', { currentTimeout });
  }


  // playSingleSound(name, buffer) {
  //   this.stopAllSounds();
  //   this.startSound(name, buffer);
  // }

  // isPlayingSound(name) {
  //   return this.soundSources[name] !== undefined;
  // }

  stopAllSounds() {
    Object.keys(this.soundSources).forEach((name) => this.stopSound(name));
  }

  stopSound(soundName) {
    const ctl = this.soundSources[soundName];
    if (!ctl) return;
    if (!ctl.source.stop) {
      ctl.source.noteOff(0);
    } else {
      ctl.source.stop(0);
    }
    delete this.soundSources[soundName];
  }

  startSound(soundName, buffer, loop = false) {
    let ctl = this.soundSources[soundName];
    if (ctl) {
      this.stopSound(soundName);
      ctl = null;
    }
    if (!ctl) {
      ctl = this.context.createSource(buffer);
      this.soundSources[soundName] = ctl;
      ctl.source.loop = loop;
      if (!loop) {
        ctl.source.onended = this.onSoundEnded;
      }
      ctl.source.customData = { soundName };
      // ctl.gainNode.gain.value = 0;
      ctl.gainNode.gain.value = 0.1;
      if (!ctl.source.start) {
        ctl.source.noteOn(0);
      } else {
        ctl.source.start(0);
      }
    }
  }
}
