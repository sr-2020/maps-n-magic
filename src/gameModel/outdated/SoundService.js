// eslint-disable-next-line max-classes-per-file
import * as R from 'ramda';
import { EventEmitter } from 'events';
import { getEeStats } from '../utils/miscUtils';
import { DisposeController } from '../utils/DisposeController';

import { SoundMappingService } from './SoundMappingService';

// sound statuses:
// sound data
// {
//   name,
//   hash,
//   status, unloaded loading loaded
//   buffer: null
//   size,
// }

const soundRequiredFields = ['name', 'hash', 'size', 'status', 'buffer'];

const sortByNameCaseInsensitive = R.sortBy(R.compose(R.toLower, R.prop('name')));

export class SoundService extends EventEmitter {
  constructor(soundPlayer) {
    super();

    // sound load
    this.abortController = new AbortController();

    // this.context = context;
    // sound player
    // this.soundPlayer = new SoundPlayer(context);
    this.soundPlayer = soundPlayer;

    // sound data
    this.sounds = [];

    // sound mapping
    this.soundMappingService = new SoundMappingService();

    // sound load
    // this._getSoundList();
    // this.pollInterval = setInterval(() => {
    //   this._getSoundList();
    // }, POLL_INTERVAL);

    this.disposeController = new DisposeController();
    const { signal } = this.abortController;
    signal.addEventListener('abort', () => {
      // clearInterval(this.pollInterval);
      // this.emit('stopAllSounds');
      this.soundPlayer.stopAllSounds();
    });
  }

  dispose() {
    this.abortController.abort();
    this.disposeController.dispose();
  }

  getSoundMapping() {
    return this.soundMappingService.getSoundMapping();
  }

  mapSoundToKey(key, soundName) {
    if (this.getSound(soundName)) {
      this.soundMappingService.mapSoundToKey(key, soundName);
      // this.loadSound(soundName);
      this.emit('soundToKeySet', {
        key,
        soundName,
      });
    } else {
      console.error('Trying to map to absent sound key', key, 'sound', soundName);
    }
  }

  getSoundForKey(key) {
    return this.soundMappingService.getSoundForKey(key);
  }

  // on(...args) {
  //   const res = super.on.apply(this, args);
  //   console.log('on', getEeStats(this));
  //   return res;
  // }

  // off(...args) {
  //   const res = super.off.apply(this, args);
  //   console.log('off', getEeStats(this));
  //   return res;
  // }

  // _getLSSounds = function () {
  //   const sounds = localStorage.getItem(LS_KEY);
  //   return sounds ? JSON.parse(sounds) : null;
  // }

  getSounds = function () {
    return this.sounds;
  }

  getSound = function (name) {
    return this.sounds.find((sound) => sound.name === name);
  }

  getSoundIndex = function (name) {
    return this.sounds.findIndex((sound) => sound.name === name);
  }

  loadedSound(sound) {
    const soundKeys = R.keys(sound);
    const diff = R.difference(soundRequiredFields, soundKeys);
    if (diff.length > 0) {
      throw new Error(`Some sound field is missing: name ${sound.name}, diff ${diff}`);
    }

    const index = this.getSoundIndex(sound.name);
    if (index === -1) {
      this.sounds.push(sound);
      this.sounds = sortByNameCaseInsensitive(this.sounds);
    } else {
      this.sounds[index] = sound;
    }
    this.emit('soundsUpdate');
  }

  // canPlaySound = function (name) {
  //   const sound = this.getSound(name);
  //   return sound.status === 'loaded';
  // }

  playSound = function (name, doPlaySound) {
    const sound = this.getSound(name);
    if (doPlaySound) {
      // if (sound.status !== 'loaded') {
      //   console.error(`Trying to play sound which is not ready. Name ${name}, status ${sound.status}`);
      //   return;
      // }
      // this.emit('playSingleSound', {
      //   name,
      //   buffer: sound.buffer,
      // });
      this.soundPlayer.playSingleSound(name, sound.buffer);
    } else {
      // this.emit('stopSound', {
      //   name,
      // });
      this.soundPlayer.stopSound(name);
    }
  }

  stopAllSounds() {
    // this.emit('stopAllSounds');
    this.soundPlayer.stopAllSounds();
  }

  isPlayingSound(name) {
    return this.soundPlayer.isPlayingSound(name);
  }


  // loadSound = function (name) {
  //   const sound = this.getSound(name);
  //   if (sound.status !== 'unloaded') {
  //     return;
  //   }
  //   sound.status = 'loading';
  //   this.disposeController.isDisposedCheck();
  //   this.emit('soundStatusChange', {
  //     name,
  //     status: sound.status,
  //   });
  //   fetch(getUrl(SOUND_ROUTE, '/', name), {
  //     signal: this.abortController.signal,
  //   })
  //     .then((result) => {
  //       if (!result.ok) throw new Error(result);
  //       return result.arrayBuffer();
  //     }).then((result) => this.context.makeAudioBuffer(result)).then((result) => {
  //       // console.log(result);
  //       this.soundLoaded(name, result);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }

  // soundLoaded(name, result) {
  //   const sound = this.getSound(name);
  //   sound.status = 'loaded';
  //   sound.buffer = result;
  //   if (this.soundPlayer.isPlayingSound(name)) {
  //     this.soundPlayer.stopSound(name);
  //     this.soundPlayer.playSingleSound(name, result);
  //   }
  //   this.disposeController.isDisposedCheck();
  //   this.emit('soundStatusChange', {
  //     name,
  //     status: sound.status,
  //   });
  // }

  // _getSoundList() {
  //   fetch(getUrl(SOUND_LIST_ROUTE), {
  //     signal: this.abortController.signal,
  //   })
  //     .then((result) => {
  //       if (!result.ok) throw new Error(result);
  //       return result.json();
  //     }).then((result) => {
  //       this._updateSounds(result);
  //     }).catch((error) => {
  //       console.error(error);
  //     });
  // }

  // // eslint-disable-next-line max-lines-per-function
  // _updateSounds(soundList) {
  //   // console.log(soundList);

  //   const soundsMap = indexByName(this.sounds);
  //   soundList.entries = soundList.entries.filter((el) => el['.tag'] === 'file');
  //   const newSoundNames = soundList.entries.map(R.prop('name'));

  //   const oldSoundsGroups = R.groupBy((sound) => (R.includes(sound.name, newSoundNames) ? 'soundExists' : 'soundRemoved'), this.sounds);

  //   this.sounds = oldSoundsGroups.soundExists || [];

  //   const hasRemovedSounds = oldSoundsGroups.soundRemoved && oldSoundsGroups.soundRemoved.length > 0;
  //   if (hasRemovedSounds) {
  //     oldSoundsGroups.soundRemoved.forEach((sound) => this.soundPlayer.stopSound(sound.name));
  //   }

  //   const soundGroups = R.groupBy((sound) => {
  //     const curSound = soundsMap[sound.name];
  //     if (!curSound) {
  //       return 'newSound';
  //     } if (curSound.hash !== sound.content_hash) {
  //       return 'changedSound';
  //     }
  //     return 'oldSound';
  //   }, soundList.entries);

  //   // const hasChanges
  //   if (!soundGroups.newSound && !soundGroups.changedSound && !hasRemovedSounds) {
  //     return;
  //   }
  //   if (soundGroups.newSound) {
  //     this.sounds = R.concat(this.sounds, soundGroups.newSound.map((sound) => ({
  //       name: sound.name,
  //       hash: sound.content_hash,
  //       size: sound.size,
  //       status: 'unloaded',
  //     })));
  //   }
  //   if (soundGroups.changedSound) {
  //     soundGroups.changedSound.forEach((sound) => {
  //       const curSound = soundsMap[sound.name];
  //       curSound.hash = sound.content_hash;
  //       curSound.size = sound.size;
  //       if (curSound.status === 'loaded') {
  //         curSound.status = 'unloaded';
  //         this.loadSound(sound.name);
  //       }
  //     });
  //   }
  //   this.disposeController.isDisposedCheck();
  //   if (this.soundMappingService.isEmpty()) {
  //     if (newSoundNames[0]) {
  //       this.mapSoundToKey('low', newSoundNames[0]);
  //     }
  //     if (newSoundNames[1]) {
  //       this.mapSoundToKey('normal', newSoundNames[1]);
  //     }
  //     if (newSoundNames[2]) {
  //       this.mapSoundToKey('high', newSoundNames[2]);
  //     }
  //   }

  //   this.emit('soundsUpdate');
  // }
}
