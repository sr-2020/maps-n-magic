/* eslint-disable class-methods-use-this */
// eslint-disable-next-line max-classes-per-file
import * as R from 'ramda';
import { AudioContextWrapper } from './AudioContextWrapper';

// import { BufferLoader } from '../utils/audioDataUtils';
// import { COLOR_PALETTE } from '../utils/colorPalette';

// const BUFFERS_TO_LOAD = {
//   // // kick: 'sounds/kick.wav',
//   // // snare: 'sounds/snare.wav',
//   // // hihat: 'sounds/hihat.wav',
//   // // jam: 'sounds/br-jam-loop.wav',
//   // // crowd: 'sounds/clapping-crowd.wav',
//   // drums: 'sounds/stargazer.mp3',
//   // organ: 'sounds/nightwalker.mp3',
//   techno: 'sounds/BoxCat_Games_-_10_-_Epic_Song.mp3',
//   // // drums: 'sounds/blueyellow.wav',
//   // // organ: 'sounds/organ-echo-chords.wav',
//   ghost: 'sounds/techno.wav',
// };


class SoundPlayer {
  context = null;

  soundSources = {};

  // TODO keep sound name uniqueness
  // buffers = [];

  constructor(context) {
    // this.context = createContext();
    this.context = context;
    // this.isLoaded = this.loadBuffers(buffersToLoad).then();
    // this.oldColors = oldColors;
  }

  // makeAudioBuffer(buffer) {
  //   return this.context.makeAudioBuffer(buffer);
  //   // return this.context.decodeAudioData(buffer);
  // }

  // isLoaded = () => this.isLoaded;


  playSingleSound(name, buffer) {
    this.stopAllSounds();
    this.startSound(name, buffer);
  }

  isPlayingSound(name) {
    return this.soundSources[name] !== undefined;
  }

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

  startSound = (soundName, buffer) => {
    let ctl = this.soundSources[soundName];
    if (!ctl) {
      ctl = this.context.createSource(buffer);
      this.soundSources[soundName] = ctl;

      // ctl.gainNode.gain.value = 0;
      if (!ctl.source.start) {
        ctl.source.noteOn(0);
      } else {
        ctl.source.start(0);
      }
    }
  }

  // loadBuffers = function (buffersToLoad) {
  //   // Array-ify
  //   const names = [];
  //   const paths = [];

  //   R.keys(buffersToLoad).forEach((name) => {
  //     const path = buffersToLoad[name];
  //     names.push(name);
  //     paths.push(path);
  //   });
  //   return new Promise((resolve) => {
  //     const bufferLoader = new BufferLoader(this.context, paths, ((bufferList) => {
  //       for (let i = 0; i < bufferList.length; i++) {
  //         const buffer = bufferList[i];
  //         const name = names[i];
  //         this.buffers.push({
  //           name,
  //           buffer,
  //           props: {
  //             color: this.oldColors[name] || COLOR_PALETTE[i].color.background,
  //           },
  //         });
  //       }
  //       resolve();
  //     }));
  //     bufferLoader.load();
  //   });
  // }

  // addAudioFile = (fileData) => new Promise((resolve) => {
  //   this.context.decodeAudioData(fileData.buffer, (buffer) => {
  //     this.buffers.push({
  //       name: fileData.name,
  //       buffer,
  //       props: {
  //         color: this.oldColors[fileData.name] || COLOR_PALETTE[this.buffers.length].color.background,
  //       },
  //     });
  //     resolve();
  //   });
  // })

  // getBuffers = () => this.buffers;

  // getSoundNames = () => this.buffers.map(R.prop('name'));

  // startSounds(soundList) {
  //   soundList.forEach(this.startSound);
  // }


  // removeSound = (soundName) => {
  //   this.stopSound();
  //   this.buffers = this.buffers.filter((bufferInfo2) => bufferInfo2.name !== soundName);
  // }


  // stopSounds = () => {
  //   R.keys(this.soundSources).forEach(this.stopSound);
  // }

  // applyVolumes = (volumes) => {
  //   volumes.forEach((volumeData) => {
  //     const source = (this.soundSources[volumeData.name]);
  //     if (!source) {
  //       this.startSound(volumeData.name);
  //     }
  //   });
  //   volumes.forEach((volumeData) => (this.soundSources[volumeData.name].gainNode.gain.value = volumeData.gain));
  // }

  // toJson = () => this.buffers.map((bufferInfo) => ({
  //   name: bufferInfo.name,
  //   props: bufferInfo.props,
  //   // ...bufferInfo,
  //   // buffer: this.ab2b64(bufferInfo.buffer)
  // }))

  // fromJson = (data) => {
  //   // console.log('555');
  //   data.map((bufferInfo) => ({
  //     name: bufferInfo.name,
  //     props: bufferInfo.props,
  //   }));
  // }

  // getSoundProps = (soundName) => {
  //   const buffer = this.buffers.find((bufferInfo2) => bufferInfo2.name === soundName);
  //   if (buffer) {
  //     // console.log(soundName, 'buffer.props', buffer.props);
  //     return buffer.props;
  //   }
  //   return {};
  // }

  // ab2b64(buf) {
  //   return btoa(
  //     new Uint8Array(buf)
  //       .reduce((data, byte) => data + String.fromCharCode(byte), ''),
  //   );
  // }

  // b642ab(base64) {
  //   const binaryString = window.atob(base64);
  //   const len = binaryString.length;
  //   const bytes = new Uint8Array(len);
  //   for (let i = 0; i < len; i++) {
  //     bytes[i] = binaryString.charCodeAt(i);
  //   }
  //   return bytes.buffer;
  // }
}

export { SoundPlayer };
