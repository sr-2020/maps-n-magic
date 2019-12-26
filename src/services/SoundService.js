import * as R from 'ramda';
import { EventEmitter } from 'events';
import { SoundPlayer } from '../utils/SoundPlayer';
import { getEeStats } from '../utils/miscUtils';
import { DisposeController } from '../utils/DisposeController';

const LS_KEY = 'sounds';
const POLL_INTERVAL = 15000; // ms
const SOUND_URL = 'http://localhost:3001';
const SOUND_LIST_ROUTE = '/fileList';
const SOUND_ROUTE = '/file';
function getUrl(...args) {
  return SOUND_URL + args.join('');
}

// sound statuses:
// sound data
// {
//   name,
//   hash,
//   status, unloaded loading loaded
//   buffer: null
//   size,
// }

const indexByName = R.indexBy(R.prop('name'));

export class SoundService extends EventEmitter {
  constructor({ sounds } = {}) {
    super();
    this.abortController = new AbortController();
    this.soundPlayer = new SoundPlayer();
    this.sounds = sounds || this._getLSSounds() || [];
    this._getSoundList();
    this.pollInterval = setInterval(() => {
      this._getSoundList();
    }, POLL_INTERVAL);
    this.disposeController = new DisposeController();
    const { signal } = this.abortController;
    signal.addEventListener('abort', () => {
      clearInterval(this.pollInterval);
      this.soundPlayer.stopAllSounds();
    });
  }

  dispose() {
    this.abortController.abort();
    this.disposeController.dispose();
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

  _getLSSounds = function () {
    const sounds = localStorage.getItem(LS_KEY);
    return sounds ? JSON.parse(sounds) : null;
  }

  getSounds = function () {
    return this.sounds;
  }

  getSound = function (name) {
    return this.sounds.find((sound) => sound.name === name);
    // return this.sounds;
  }

  canPlaySound = function (name) {
    const sound = this.getSound(name);
    return sound.status === 'loaded';
  }

  playSound = function (name, doPlaySound) {
    const sound = this.getSound(name);
    if (doPlaySound) {
      if (sound.status !== 'loaded') {
        console.error(`Trying to play sound which is not ready. Name ${name}, status ${sound.status}`);
        return;
      }
      this.soundPlayer.playSingleSound(name, sound.buffer);
    } else {
      this.soundPlayer.stopSound(name);
    }
    // return sound.status === 'loaded';
  }

  stopAllSounds() {
    this.soundPlayer.stopAllSounds();
  }

  isPlayingSound(name) {
    return this.soundPlayer.isPlayingSound(name);
  }

  loadSound = function (name) {
    const sound = this.getSound(name);
    if (sound.status !== 'unloaded') {
      return;
    }
    sound.status = 'loading';
    this.disposeController.isDisposedCheck();
    this.emit('soundStatusChange', {
      name,
      status: sound.status,
    });
    fetch(getUrl(SOUND_ROUTE, '/', name), {
      signal: this.abortController.signal,
    })
      .then((result) => {
        if (!result.ok) throw new Error(result);
        return result.arrayBuffer();
      }).then((result) => this.soundPlayer.makeAudioBuffer(result)).then((result) => {
        // console.log(result);
        this.soundLoaded(name, result);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  soundLoaded(name, result) {
    const sound = this.getSound(name);
    sound.status = 'loaded';
    sound.buffer = result;
    this.disposeController.isDisposedCheck();
    this.emit('soundStatusChange', {
      name,
      status: sound.status,
    });
  }

  _getSoundList() {
    fetch(getUrl(SOUND_LIST_ROUTE), {
      signal: this.abortController.signal,
    })
      .then((result) => {
        if (!result.ok) throw new Error(result);
        return result.json();
      }).then((result) => {
        this._updateSounds(result);
      }).catch((error) => {
        console.error(error);
      });
  }

  _updateSounds(soundList) {
    console.log(soundList);
    const soundsMap = indexByName(this.sounds);
    const newSoundNames = soundList.entries.map(R.prop('name'));

    this.sounds = this.sounds.filter((sound) => R.includes(sound.name, newSoundNames));

    // R.keys(soundsMap).filter

    // R.difference(R.keys(soundsMap), R.keys(newSoundsMap)
    const soundGroups = R.groupBy((sound) => {
      const curSound = soundsMap[sound.name];
      if (!curSound) {
        return 'newSound';
      } if (curSound.hash !== sound.content_hash) {
        return 'changedSound';
      }
      return 'oldSound';
    }, soundList.entries);

    // const hasChanges
    if (!soundGroups.newSound && !soundGroups.changedSound) {
      return;
    }
    if (soundGroups.newSound) {
      this.sounds = R.concat(this.sounds, soundGroups.newSound.map((sound) => ({
        name: sound.name,
        hash: sound.content_hash,
        size: sound.size,
        status: 'unloaded',
      })));
    }
    if (soundGroups.changedSound) {
      soundGroups.changedSound.forEach((sound) => {
        const curSound = soundsMap(sound.name);
        curSound.hash = sound.content_hash;
        if (curSound.status === 'loaded') {
          // TODO start loading
        }
      });
    }
    this.disposeController.isDisposedCheck();
    this.emit('soundsUpdate');

    // const newSoundsMap = indexByName(soundList.entries);
    // Object.keys(newSoundsMap).forEach(newSoundName => {
    //   if (!soundsMap[newSoundName]) {
    //     this.sounds.push({
    //       name: newSoundName,
    //       hash: newSoundsMap[]
    //     })
    //   }
    // });

    // this.r = 4;
  }

  // async getFileList() {
  //   // await fetch();
  //   this.rrr = 5;

  //   return fetch('http://localhost:3001/fileList')
  //     .then((result) => {
  //       if (!result.ok) throw new Error(result);
  //       return result.json();
  //     }).catch((error) => {
  //       console.error(error);
  //       throw error;
  //     });
  // }
}
