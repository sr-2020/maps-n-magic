import * as R from 'ramda';
import { AbstractService, Metadata, GameModel, GMLogger } from 'sr2020-mm-event-engine';

const sortByNameCaseInsensitive = R.sortBy(R.compose(R.toLower, R.prop('name')));

const soundRequiredFields = ['name', 'hash', 'size', 'status', 'buffer'];

const metadata: Metadata = {
  actions: ['soundLoaded', 'soundsRemoved', 'clearMissingSounds'],
  requests: ['sounds', 'sound'],
  emitEvents: ['soundLoaded', 'soundsRemoved', 'missingSoundsCleared'],
  needRequests: [],
  needActions: [],
  listenEvents: []
};

interface Sound {
  status: '' | 'loaded' | 'unloaded';
  name: string;
}
export class SoundService2 extends AbstractService {
  sounds: Sound[];

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(metadata);
    this.sounds = [];
  }

  // @ts-ignore
  setData({ sounds } = {}) {
    this.sounds = sounds || [];
    this.sounds.forEach((sound) => (sound.status = ''));
  }

  getData() {
    return {
      sounds: this.sounds.map(R.pick(['name', 'hash', 'size'])),
    };
  }

  // TODO rework execute and get methods
  // execute(action) {
  //   if (action.type === 'soundLoaded') {
  //     return this._soundLoaded(action);
  //   }
  //   if (action.type === 'soundsRemoved') {
  //     return this._soundsRemoved(action);
  //   }
  //   if (action.type === 'clearMissingSounds') {
  //     return this._clearMissingSounds();
  //   }
  //   // return onDefaultAction(action);
  // }

  // get(request) {
  //   if (request.type === 'sounds') {
  //     return this._getSounds();
  //   }
  //   if (request.type === 'sound') {
  //     return this._getSound(request);
  //   }
  //   // return onDefaultRequest(request);
  // }

  // dispose() {
  //   // this._stop();
  // }

  _getSounds () {
    return this.sounds;
  }

  _getSound ({ name }) {
    return this.sounds.find((sound) => sound.name === name);
  }

  _getSoundIndex (name) {
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
