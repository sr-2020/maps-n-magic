import * as R from 'ramda';
import { Component } from 'react';
import './SoundWatcher.css';

// TODO this call should be moved in event engine service
import { 
  AudioContextWrapper,
  getSound, 
  Sound, 
  SOUND_LIST
  // getSoundList 
} from 'sr2020-mm-client-event-engine';
import { GameModel } from 'sr2020-mm-event-engine';

import { assert } from 'console';

const POLL_INTERVAL = 15000; // ms


interface ExternalSound {
  // .tag: "file"
  ".tag": string;
  // client_modified: "2019-12-28T00:38:34Z"
  // content_hash: "d830e7f9084f3745427bbb988fe42ed9d9cf12479a482895162f39d89a593058"
  content_hash: string;
  // id: "id:vM1Ht3UYasAAAAAAAAAAPw"
  // is_downloadable: true
  // name: "mana_weak_07072013.mp3"
  name: string;
  // parent_shared_folder_id: "6768512912"
  // path_display: "/SR_sounds/mana_weak_07072013.mp3"
  // path_lower: "/sr_sounds/mana_weak_07072013.mp3"
  // rev: "0159ab8d4971d2100000001936f4f90"
  // server_modified: "2019-12-28T00:38:34Z"
  // size: 701652
  size: number;
}

type SoundMap = {[name: string]: Sound};
type IndexByName = (sounds: Sound[]) => SoundMap;
const indexByName = R.indexBy(R.prop('name')) as IndexByName;

interface SoundWatcherProps {
  gameModel: GameModel;
  context: AudioContextWrapper;
};
interface SoundWatcherState {
  // users: UserRecord[]; 
  // locationIndex: LocationIndex;
  // sortedLocationList: LocationRecord[];
  // beaconIndex: BeaconIndex;
};

export class SoundWatcher extends Component<SoundWatcherProps, SoundWatcherState> {
  sounds: Sound[];

  abortController: AbortController;

  // pollInterval: NodeJS.Timeout;

  constructor(props: SoundWatcherProps) {
    super(props);
    this.sounds = [];
    this.abortController = new AbortController();
    this.state = {
    };
  }

  componentDidMount(): void {
    // this._getSoundList();
    // this.pollInterval = setInterval(() => {
    //   this._getSoundList();
    // }, POLL_INTERVAL);
    this.sounds = SOUND_LIST.map(soundName => ({
      name: soundName,
      status: 'unloaded',
    }));
    SOUND_LIST.forEach((soundName) => this.loadSound(soundName));

    // const { signal } = this.abortController;
    // signal.addEventListener('abort', () => {
    //   clearInterval(this.pollInterval);
    //   // this.emit('stopAllSounds');
    //   // this.soundPlayer.stopAllSounds();
    // });
    // console.log('SoundWatcher mounted');
  }

  componentDidUpdate(): void {
    // console.log('SoundWatcher did update');
  }

  componentWillUnmount(): void {
    this.abortController.abort();
    // console.log('SoundWatcher will unmount');
  }

  getSound(name: string): Sound | undefined {
    return this.sounds.find((sound) => sound.name === name);
  }

  // eslint-disable-next-line react/sort-comp
  // _getSoundList(): void {
  //   getSoundList(this.abortController).then((result) => {
  //     console.log(`Sound list fetched ${result.entries.length}`);
  //     this._updateSounds(result);
  //   }).catch((error) => {
  //     console.error(error);
  //   });
  // }

  // // eslint-disable-next-line max-lines-per-function
  // _updateSounds(soundList: {entries: ExternalSound[]}): void {
  //   // console.log(soundList);

  //   const soundsMap = indexByName(this.sounds);
  //   soundList.entries = soundList.entries.filter((el) => el['.tag'] === 'file');
  //   const newSoundNames = soundList.entries.map(R.prop('name'));

  //   const oldSoundsGroups = R.groupBy((sound) => (R.includes(sound.name, newSoundNames) ? 'soundExists' : 'soundRemoved'), this.sounds);

  //   this.sounds = oldSoundsGroups.soundExists || [];

  //   const hasRemovedSounds = oldSoundsGroups.soundRemoved && oldSoundsGroups.soundRemoved.length > 0;
  //   if (hasRemovedSounds) {
  //     // console.log(`Removed sounds ${oldSoundsGroups.soundRemoved.map(R.prop('name'))}`);
  //     this.props.gameModel.execute({
  //       type: 'soundsRemoved',
  //       sounds: oldSoundsGroups.soundRemoved,
  //     });
  //     // oldSoundsGroups.soundRemoved.forEach((sound) => this.soundPlayer.stopSound(sound.name));
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
  //     const newSounds = soundGroups.newSound.map((sound) => ({
  //       name: sound.name,
  //       hash: sound.content_hash,
  //       size: sound.size,
  //       status: 'unloaded',
  //     }));
  //     this.sounds = R.concat(this.sounds, newSounds);
  //     newSounds.forEach((sound) => this.loadSound(sound.name));
  //   }
  //   if (soundGroups.changedSound) {
  //     soundGroups.changedSound.forEach((sound) => {
  //       const curSound = soundsMap[sound.name];
  //       curSound.hash = sound.content_hash;
  //       curSound.size = sound.size;
  //       // if (curSound.status === 'loaded') {
  //       curSound.status = 'unloaded';
  //       this.loadSound(sound.name);
  //       // }
  //     });
  //   }
  //   // this.disposeController.isDisposedCheck();
  //   // if (this.soundMappingService.isEmpty()) {
  //   //   if (newSoundNames[0]) {
  //   //     this.mapSoundToKey('low', newSoundNames[0]);
  //   //   }
  //   //   if (newSoundNames[1]) {
  //   //     this.mapSoundToKey('normal', newSoundNames[1]);
  //   //   }
  //   //   if (newSoundNames[2]) {
  //   //     this.mapSoundToKey('high', newSoundNames[2]);
  //   //   }
  //   // }

  //   // this.emit('soundsUpdate');
  // }

  async loadSound(name: string): Promise<void> {
    const sound = this.getSound(name);
    if (sound === undefined) {
      throw new Error('loadSound ' + name + ' but not found in sounds collection');
    }
    if (sound.status === 'loading' || sound.status === 'loaded') {
      return;
    }
    this.setSound(name, {
      ...sound,
      status: 'loading'
    });
    // (sound as Sound).status = 'loading';
    try {
      const arrayBuffer = await getSound(name, this.abortController);
      const decodedData = await this.props.context.makeAudioBuffer(arrayBuffer);
      this.soundLoaded(name, decodedData);
    } catch (error) {
      console.error(error);
    }
  }

  setSound (soundName: string, sound: Sound) {
    const index = this.sounds.findIndex((sound) => sound.name === soundName);
    if (index === -1) {
      console.error(`Can't find sound with name ${soundName}`);
      return;
    }
    this.sounds[index] = sound;
    return sound;
  }

  soundLoaded(name: string, result: AudioBuffer): void {
    console.log('soundLoaded', name);
    const sound = this.getSound(name);
    if (sound === undefined) {
      throw new Error('soundLoaded ' + name + ' but not found in sounds collection');
    }
    // assert(sound !== undefined);
    // sound.status = 'loaded';
    // sound.buffer = result;
    const sound2 = this.setSound(name, {
      ...sound,
      buffer: result,
      status: 'loaded'
    });
    this.props.gameModel.execute({
      type: 'soundLoaded',
      sound: sound2,
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

  render(): null {
    return null;
  }
}
