/* eslint-disable class-methods-use-this */
// eslint-disable-next-line max-classes-per-file
import * as R from 'ramda';

export class SoundStage {
  context = null;

  backgroundSound = null;

  rotationSounds = [];

  // soundSources = {};

  constructor(context) {
    this.context = context;
  }

  subscribeOnModel(gameModel) {
    this.gameModel = gameModel;
  }

  _subscribe() {

  }

  _unsubscribe() {

  }

  // playSingleSound(name, buffer) {
  //   this.stopAllSounds();
  //   this.startSound(name, buffer);
  // }

  // isPlayingSound(name) {
  //   return this.soundSources[name] !== undefined;
  // }

  // stopAllSounds() {
  //   Object.keys(this.soundSources).forEach((name) => this.stopSound(name));
  // }

  // stopSound(soundName) {
  //   const ctl = this.soundSources[soundName];
  //   if (!ctl) return;
  //   if (!ctl.source.stop) {
  //     ctl.source.noteOff(0);
  //   } else {
  //     ctl.source.stop(0);
  //   }
  //   delete this.soundSources[soundName];
  // }

  // startSound = (soundName, buffer) => {
  //   let ctl = this.soundSources[soundName];
  //   if (!ctl) {
  //     ctl = this.context.createSource(buffer);
  //     this.soundSources[soundName] = ctl;

  //     // ctl.gainNode.gain.value = 0;
  //     if (!ctl.source.start) {
  //       ctl.source.noteOn(0);
  //     } else {
  //       ctl.source.start(0);
  //     }
  //   }
  // }
}
