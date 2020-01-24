import * as R from 'ramda';

import { AbstractService } from './AbstractService';

export class SoundStageService extends AbstractService {
  metadata = {
    actions: ['setBackgroundSound', 'rotationSoundsChange', 'clearSoundStage'],
    requests: ['soundStage'],
    emitEvents: ['backgroundSoundUpdate', 'rotationSoundsUpdate'],
  };

  constructor() {
    super();
    this.backgroundSound = null;
    this.rotationSounds = [];
    this.rotationTimeout = 2000;
    this.rotationSoundTimeout = 5000;
  }

  execute(action, onDefaultAction) {
    if (action.type === 'setBackgroundSound') {
      return this._setBackgroundSound(action);
    }
    if (action.type === 'rotationSoundsChange') {
      return this._rotationSoundsChange(action);
    }
    if (action.type === 'clearSoundStage') {
      return this._clearSoundStage(action);
    }
    if (action.type === 'setRotationTimeout') {
      return this._setRotationTimeout(action);
    }
    if (action.type === 'setRotationSoundTimeout') {
      return this._setRotationSoundTimeout(action);
    }
    return onDefaultAction(action);
  }

  get(request, onDefaultRequest) {
    if (request.type === 'soundStage') {
      return this._getSoundStage();
    }
    return onDefaultRequest(request);
  }

  // dispose() {
  //   // this._stop();
  // }

  _setBackgroundSound({ name }) {
    this.backgroundSound = name;
    this.emit('backgroundSoundUpdate', {
      backgroundSound: this.backgroundSound,
    });
  }

  _setRotationTimeout({ rotationTimeout }) {
    this.rotationTimeout = rotationTimeout;
    this.emit('rotationTimeoutUpdate', {
      rotationTimeout,
    });
  }

  _setRotationSoundTimeout({ rotationSoundTimeout }) {
    this.rotationSoundTimeout = rotationSoundTimeout;
    this.emit('rotationSoundTimeoutUpdate', {
      rotationSoundTimeout,
    });
  }

  _clearSoundStage() {
    const hasBackgroundSound = !!this.backgroundSound;
    if (hasBackgroundSound) {
      this.backgroundSound = null;
      this.emit('backgroundSoundUpdate', {
        backgroundSound: this.backgroundSound,
      });
    }
    const hasRotationSounds = this.rotationSounds.length !== 0;
    if (hasRotationSounds) {
      this.rotationSounds = [];
      this.emit('rotationSoundsUpdate', {
        rotationSounds: this.rotationSounds,
      });
    }
  }

  _rotationSoundsChange({ added = [], removed = [] }) {
    const sounds = R.difference(this.rotationSounds, removed).concat(added);
    if (R.symmetricDifference(this.rotationSounds, sounds).length !== 0) {
      this.rotationSounds = sounds;
      this.emit('rotationSoundsUpdate', {
        rotationSounds: this.rotationSounds,
      });
    }
  }

  _getSoundStage() {
    return {
      backgroundSound: this.backgroundSound,
      rotationSounds: [...this.rotationSounds],
      rotationTimeout: this.rotationTimeout,
      rotationSoundTimeout: this.rotationSoundTimeout,
    };
  }
}
