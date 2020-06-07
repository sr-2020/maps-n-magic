import * as R from 'ramda';
import { Component } from 'react';
import './SoundWatcher.css';

import { getSound, getSoundList } from '../../gameModel/api/sounds';

const POLL_INTERVAL = 15000; // ms

const indexByName = R.indexBy(R.prop('name'));

// import { SoundWatcherPropTypes } from '../../types';

export class SoundWatcher extends Component {
  // static propTypes = SoundWatcherPropTypes;

  constructor() {
    super();
    this.sounds = [];
    this.abortController = new AbortController();
    this.state = {
    };
  }

  componentDidMount = () => {
    this._getSoundList();
    this.pollInterval = setInterval(() => {
      this._getSoundList();
    }, POLL_INTERVAL);

    const { signal } = this.abortController;
    signal.addEventListener('abort', () => {
      clearInterval(this.pollInterval);
      // this.emit('stopAllSounds');
      // this.soundPlayer.stopAllSounds();
    });
    console.log('SoundWatcher mounted');
  }

  componentDidUpdate = () => {
    console.log('SoundWatcher did update');
  }

  componentWillUnmount = () => {
    this.abortController.abort();
    console.log('SoundWatcher will unmount');
  }

  getSound = function (name) {
    return this.sounds.find((sound) => sound.name === name);
  }

  // eslint-disable-next-line react/sort-comp
  _getSoundList() {
    getSoundList(this.abortController).then((result) => {
      console.log(`Sound list fetched ${result.entries.length}`);
      this._updateSounds(result);
    }).catch((error) => {
      console.error(error);
    });
  }

  // eslint-disable-next-line max-lines-per-function
  _updateSounds(soundList) {
    // console.log(soundList);

    const soundsMap = indexByName(this.sounds);
    soundList.entries = soundList.entries.filter((el) => el['.tag'] === 'file');
    const newSoundNames = soundList.entries.map(R.prop('name'));

    const oldSoundsGroups = R.groupBy((sound) => (R.includes(sound.name, newSoundNames) ? 'soundExists' : 'soundRemoved'), this.sounds);

    this.sounds = oldSoundsGroups.soundExists || [];

    const hasRemovedSounds = oldSoundsGroups.soundRemoved && oldSoundsGroups.soundRemoved.length > 0;
    if (hasRemovedSounds) {
      // console.log(`Removed sounds ${oldSoundsGroups.soundRemoved.map(R.prop('name'))}`);
      this.props.gameModel.execute({
        type: 'soundsRemoved',
        sounds: oldSoundsGroups.soundRemoved,
      });
      // oldSoundsGroups.soundRemoved.forEach((sound) => this.soundPlayer.stopSound(sound.name));
    }

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
    if (!soundGroups.newSound && !soundGroups.changedSound && !hasRemovedSounds) {
      return;
    }
    if (soundGroups.newSound) {
      const newSounds = soundGroups.newSound.map((sound) => ({
        name: sound.name,
        hash: sound.content_hash,
        size: sound.size,
        status: 'unloaded',
      }));
      this.sounds = R.concat(this.sounds, newSounds);
      newSounds.forEach((sound) => this.loadSound(sound.name));
    }
    if (soundGroups.changedSound) {
      soundGroups.changedSound.forEach((sound) => {
        const curSound = soundsMap[sound.name];
        curSound.hash = sound.content_hash;
        curSound.size = sound.size;
        // if (curSound.status === 'loaded') {
        curSound.status = 'unloaded';
        this.loadSound(sound.name);
        // }
      });
    }
    // this.disposeController.isDisposedCheck();
    // if (this.soundMappingService.isEmpty()) {
    //   if (newSoundNames[0]) {
    //     this.mapSoundToKey('low', newSoundNames[0]);
    //   }
    //   if (newSoundNames[1]) {
    //     this.mapSoundToKey('normal', newSoundNames[1]);
    //   }
    //   if (newSoundNames[2]) {
    //     this.mapSoundToKey('high', newSoundNames[2]);
    //   }
    // }

    // this.emit('soundsUpdate');
  }

  loadSound = function (name) {
    const sound = this.getSound(name);
    if (sound.status !== 'unloaded') {
      return;
    }
    sound.status = 'loading';
    getSound(name, this.abortController).then((result) => this.props.context.makeAudioBuffer(result)).then((result) => {
      // console.log(result);
      this.soundLoaded(name, result);
    })
      .catch((error) => {
        console.error(error);
      });
  }

  soundLoaded(name, result) {
    console.log('soundLoaded', name);
    const sound = this.getSound(name);
    sound.status = 'loaded';
    sound.buffer = result;
    this.props.gameModel.execute({
      type: 'soundLoaded',
      sound,
    });
    // if (this.soundPlayer.isPlayingSound(name)) {
    //   this.soundPlayer.stopSound(name);
    //   this.soundPlayer.playSingleSound(name, result);
    // }
    // this.disposeController.isDisposedCheck();
    // this.emit('soundLoaded', {
    //   sound,
    // });
    // this.emit('soundStatusChange', {
    //   name,
    //   status: sound.status,
    // });
  }

  render() {
    return null;
  }
}
