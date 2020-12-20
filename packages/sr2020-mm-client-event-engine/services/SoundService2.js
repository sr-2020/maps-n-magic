import * as R from 'ramda';
import { AbstractService } from 'sr2020-mm-event-engine/core/AbstractService';

const sortByNameCaseInsensitive = R.sortBy(R.compose(R.toLower, R.prop('name')));

const soundRequiredFields = ['name', 'hash', 'size', 'status', 'buffer'];

export class SoundService2 extends AbstractService {
  metadata = {
    actions: ['soundLoaded', 'soundsRemoved', 'clearMissingSounds'],
    requests: ['sounds', 'sound'],
    emitEvents: ['soundLoaded', 'soundsRemoved', 'missingSoundsCleared'],
  };

  constructor() {
    super();
    this.sounds = [];
  }

  setData({ sounds } = {}) {
    this.sounds = sounds || [];
    this.sounds.forEach((sound) => (sound.status = 'unloaded'));
  }

  getData() {
    return {
      sounds: this.sounds.map(R.pick(['name', 'hash', 'size'])),
    };
  }

  execute(action, onDefaultAction) {
    if (action.type === 'soundLoaded') {
      return this._soundLoaded(action);
    }
    if (action.type === 'soundsRemoved') {
      return this._soundsRemoved(action);
    }
    if (action.type === 'clearMissingSounds') {
      return this._clearMissingSounds();
    }
    return onDefaultAction(action);
  }

  get(request, onDefaultRequest) {
    if (request.type === 'sounds') {
      return this._getSounds();
    }
    if (request.type === 'sound') {
      return this._getSound(request);
    }
    return onDefaultRequest(request);
  }

  // dispose() {
  //   // this._stop();
  // }

  _getSounds = function () {
    return this.sounds;
  }

  _getSound = function ({ name }) {
    return this.sounds.find((sound) => sound.name === name);
  }

  _getSoundIndex = function (name) {
    return this.sounds.findIndex((sound) => sound.name === name);
  }

  _soundLoaded({ sound }) {
    const soundKeys = R.keys(sound);
    const diff = R.difference(soundRequiredFields, soundKeys);
    if (diff.length > 0) {
      throw new Error(`Some sound field is missing: name ${sound.name}, diff ${diff}`);
    }
    const index = this._getSoundIndex(sound.name);
    if (index === -1) {
      this.sounds.push(sound);
      this.sounds = sortByNameCaseInsensitive(this.sounds);
    } else {
      this.sounds[index] = sound;
    }
    // this.emit('soundsUpdate');
    this.emit('soundLoaded', { sound });
  }

  _soundsRemoved({ sounds }) {
    const removedSounds = sounds.map(R.prop('name'));
    this.sounds = this.sounds.filter((sound1) => !removedSounds.includes(sound1.name));
    this.emit('soundsRemoved', { sounds });
    // const sound2 = this._getSound({ name: sound.name });
    // if (sound2) {
    //   sound2.status = 'unloaded';
    //   delete sound.buffer;
    //   this.emit('soundRemoved', { sound });
    // }
    // const index = this._getSoundIndex(sound.name);
  }

  _clearMissingSounds() {
    const length1 = this.sounds.length;
    this.sounds = this.sounds.filter((sound) => sound.status === 'loaded');
    if (this.sounds.length !== length1) {
      this.emit('missingSoundsCleared');
    }
  }
}
