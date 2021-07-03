export {};
// /* eslint-disable class-methods-use-this */
// // eslint-disable-next-line max-classes-per-file
// import * as R from 'ramda';
// import { EventEmitter } from 'events';

// import { 
//   shuffle, 
//   SoundStageData, 
//   GameModel, 
//   TimeoutType,
// } from 'sr2020-mm-event-engine';
// import { 
//   GetSoundStageState,
// } from 'sr2020-mm-client-event-engine';
// import { AudioContextWrapper } from '../../utils/AudioContextWrapper';

// import { Sound, SoundCtl } from "../../types";

// type SoundCollection = {
//   [name: string]: SoundCtl
// };

// export class SoundStage extends EventEmitter {
//   // context: AudioContextWrapper = null;

//   backgroundSound: string | null = null;

//   rotationSounds: string[] = [];

//   // timeout between sounds in rotation
//   rotationTimeout: number | null = null;

//   // timeout between rotations
//   rotationSoundTimeout: number | null = null;

//   backgroundVolume: number | null = null;

//   rotationVolume: number | null = null;

//   // immediate rotation data

//   playbackRotation: string[] = [];

//   backgroundSources: SoundCollection = {};

//   rotationSources: SoundCollection = {};

//   currentTimeout: number | null = null;

//   currentTimeoutType: TimeoutType | null = null;

//   rotationTimeoutId: NodeJS.Timeout | null = null;

//   gameModel: GameModel | null = null;

//   constructor(private context: AudioContextWrapper) {
//     super();
//     this.onBackgroundSoundUpdate = this.onBackgroundSoundUpdate.bind(this);
//     this.onRotationSoundsUpdate = this.onRotationSoundsUpdate.bind(this);
//     this.onRotationTimeoutUpdate = this.onRotationTimeoutUpdate.bind(this);
//     this.onRotationSoundTimeoutUpdate = this.onRotationSoundTimeoutUpdate.bind(this);
//     this.onBackgroundVolumeUpdate = this.onBackgroundVolumeUpdate.bind(this);
//     this.onRotationVolumeUpdate = this.onRotationVolumeUpdate.bind(this);
//     this.onSoundEnded = this.onSoundEnded.bind(this);
//   }

//   dispose(): void {
//     if (this.gameModel) {
//       this.subscribe('off', this.gameModel);
//     }
//     this.rotationSounds = [];
//     // this.playbackRotation = [];
//     this._setPlaybackRotation([]);
//     this.stopAllSounds();
//     if (this.rotationTimeoutId !== null) {
//       clearTimeout(this.rotationTimeoutId);
//     }
//   }

//   subscribe(action: 'on'|'off', gameModel: GameModel): void {
//     gameModel[action]('backgroundSoundUpdate', this.onBackgroundSoundUpdate);
//     gameModel[action]('rotationSoundsUpdate', this.onRotationSoundsUpdate);
//     gameModel[action]('rotationTimeoutUpdate', this.onRotationTimeoutUpdate);
//     gameModel[action]('rotationSoundTimeoutUpdate', this.onRotationSoundTimeoutUpdate);
//     gameModel[action]('backgroundVolumeUpdate', this.onBackgroundVolumeUpdate);
//     gameModel[action]('rotationVolumeUpdate', this.onRotationVolumeUpdate);
//   }

//   subscribeOnModel(gameModel: GameModel): void {
//     if (this.gameModel !== gameModel) {
//       if (this.gameModel) {
//         this.subscribe('off', this.gameModel);
//       }
//       this.gameModel = gameModel;
//       // this.initialize();
//       const soundStage = this.gameModel.get2<GetSoundStageState>({type:'soundStageState'});
//       // this.onBackgroundSoundUpdate(soundStage);
//       // this.onRotationSoundsUpdate(soundStage);
//       // this.onRotationTimeoutUpdate(soundStage);
//       // this.onRotationSoundTimeoutUpdate(soundStage);
//       // this.onBackgroundVolumeUpdate(soundStage);
//       // this.onRotationVolumeUpdate(soundStage);
//       // this.backgroundSound = soundStage.backgroundSound;
//       // this.rotationSounds = [...soundStage.rotationSounds];
//       this.subscribe('on', this.gameModel);
//       console.log('SoundStage initialize');
//     }
//   }

//   private onBackgroundSoundUpdate({ backgroundSound }: SoundStageData): void {
//     // should never happen
//     if (this.gameModel === null) return;
//     if (this.backgroundSound === backgroundSound) {
//       return;
//     }
//     if (this.backgroundSound) {
//       this.stopSound(this.backgroundSources, this.backgroundSound);
//     }
//     this.backgroundSound = backgroundSound;
//     if (this.backgroundSound) {
//       const sound = this.gameModel.get({
//         type: 'sound',
//         name: this.backgroundSound,
//       });
//       if (sound) {
//         // @ts-ignore
//         this.startSound(this.backgroundSources, this.backgroundSound, sound.buffer, this.backgroundVolume / 100, true);
//       } else {
//         console.warn(`Sound not found: ${this.backgroundSound}`);
//       }
//     }
//     console.log('SoundStage onBackgroundSoundUpdate');
//   }

//   onRotationSoundsUpdate({ rotationSounds }: SoundStageData): void {
//     if (R.symmetricDifference(this.rotationSounds, rotationSounds).length === 0) {
//       return;
//     }
//     this.rotationSounds = [...rotationSounds];
//     if (this.playbackRotation.length === 0 && this.rotationSounds.length > 0) {
//       this.generateAndStartRotation();
//     }
//     console.log('SoundStage onRotationSoundsUpdate');
//   }

//   onRotationTimeoutUpdate({ rotationTimeout }: SoundStageData): void {
//     this.rotationTimeout = rotationTimeout;
//   }

//   onRotationSoundTimeoutUpdate({ rotationSoundTimeout }: SoundStageData): void {
//     this.rotationSoundTimeout = rotationSoundTimeout;
//   }

//   onBackgroundVolumeUpdate({ backgroundVolume }: SoundStageData): void {
//     this.backgroundVolume = backgroundVolume;
//     Object.values(this.backgroundSources).forEach((ctl) => (ctl.gainNode.gain.value = backgroundVolume / 100));
//   }

//   onRotationVolumeUpdate({ rotationVolume }: SoundStageData): void {
//     this.rotationVolume = rotationVolume;
//     Object.values(this.rotationSources).forEach((ctl) => (ctl.gainNode.gain.value = rotationVolume / 100));
//   }

//   generateAndStartRotation(): void {
//     // console.log('generateAndStartRotation');
//     if (this.rotationSounds.length === 0 || this.rotationTimeoutId !== null) {
//       return;
//     }
//     this._setPlaybackRotation(shuffle([...this.rotationSounds]));
//     this.startRotationSound();
//   }

//   _setPlaybackRotation(playbackRotation: string[]): void {
//     this.playbackRotation = playbackRotation;
//     this.emit('playbackRotationUpdate', {
//       playbackRotation: this.playbackRotation,
//     });
//     console.log('playbackRotation', this.playbackRotation);
//   }

//   getPlaybackRotation(): string[] {
//     return [...this.playbackRotation];
//   }

//   startRotationSound(): void {
//     // console.log('startRotationSound');
//     if (this.gameModel === null) return;
//     const sound: Sound = this.gameModel.get({
//       type: 'sound',
//       name: this.playbackRotation[0],
//     });
//     console.log('start', this.playbackRotation[0]);
//     // @ts-ignore
//     this.startSound(this.rotationSources, this.playbackRotation[0], sound.buffer, this.rotationVolume / 100);
//   }

//   onSoundEnded(collection: SoundCollection) {
//     // @ts-ignore
//     return (e) => {
//       // console.log('onSoundEnded');
//       this.stopSound(collection, e.target.customData.soundName);
//       this._setPlaybackRotation(R.tail(this.playbackRotation));
//       if (this.playbackRotation.length > 0) {
//         console.log('startTimeout');
//         if(this.rotationTimeout !== null) {
//           this.rotationTimeoutId = setTimeout(() => {
//             this.startRotationSound();
//             this.setCurrentTimeout(null, null);
//           }, this.rotationTimeout);
//           this.setCurrentTimeout(this.rotationTimeout, TimeoutType.rotationTimeout);
//         }
//       } else if (this.rotationSounds.length > 0) {
//         console.log('startTimeout');
//         if(this.rotationSoundTimeout !== null) {
//           this.rotationTimeoutId = setTimeout(() => {
//             this.rotationTimeoutId = null;
//             this.generateAndStartRotation();
//             this.setCurrentTimeout(null, null);
//           }, this.rotationSoundTimeout);
//           this.setCurrentTimeout(this.rotationSoundTimeout, TimeoutType.rotationSoundTimeout);
//         }
//       } else {
//         this.rotationTimeoutId = null;
//       }
//       // console.log('onSoundEnded', e);
//     };
//   }

//   setCurrentTimeout(currentTimeout: number | null, currentTimeoutType: TimeoutType | null): void {
//     this.currentTimeout = currentTimeout;
//     this.currentTimeoutType = currentTimeoutType;
//     this.emit('currentTimeoutUpdate', { currentTimeout, currentTimeoutType });
//   }

//   // playSingleSound(name, buffer) {
//   //   this.stopAllSounds();
//   //   this.startSound(name, buffer);
//   // }

//   // isPlayingSound(name) {
//   //   return this.soundSources[name] !== undefined;
//   // }

//   stopAllSounds(): void {
//     Object.keys(this.rotationSources).forEach((name) => this.stopSound(this.rotationSources, name));
//     Object.keys(this.backgroundSources).forEach((name) => this.stopSound(this.backgroundSources, name));
//   }

//   stopSound(collection: SoundCollection, soundName: string): void {
//     const ctl = collection[soundName];
//     if (!ctl) return;
//     if (!ctl.source.stop) {
//       ctl.source.noteOff(0);
//     } else {
//       ctl.source.stop(0);
//     }
//     delete collection[soundName];
//   }

//   startSound(collection: SoundCollection, soundName: string, buffer: AudioBuffer, volume: number, loop: boolean = false): void {
//     let ctl: SoundCtl | undefined = collection[soundName];
//     if (ctl) {
//       this.stopSound(collection, soundName);
//       ctl = undefined;
//     }
//     if (!ctl) {
//       ctl = this.context.createSource(buffer);
//       collection[soundName] = ctl;
//       ctl.source.loop = loop;
//       if (!loop) {
//         ctl.source.onended = this.onSoundEnded(collection);
//       }
//       ctl.source.customData = { soundName };
//       // ctl.gainNode.gain.value = 0;
//       ctl.gainNode.gain.value = volume;
//       if (!ctl.source.start) {
//         ctl.source.noteOn(0);
//       } else {
//         ctl.source.start(0);
//       }
//     }
//   }
// }
