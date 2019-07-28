/* eslint-disable class-methods-use-this */
import * as R from 'ramda';

import { BufferLoader } from '../utils/audioDataUtils';
import ColorPalette from '../utils/colorPalette';

const BUFFERS_TO_LOAD = {
  // kick: 'sounds/kick.wav',
  // snare: 'sounds/snare.wav',
  // hihat: 'sounds/hihat.wav',
  // jam: 'sounds/br-jam-loop.wav',
  // crowd: 'sounds/clapping-crowd.wav',
  drums: 'sounds/stargazer.mp3',
  organ: 'sounds/nightwalker.mp3',
  techno: 'sounds/BoxCat_Games_-_10_-_Epic_Song.mp3'
  // drums: 'sounds/blueyellow.wav',
  // organ: 'sounds/organ-echo-chords.wav',
  // techno: 'sounds/techno.wav'
};

export default class AudioService {
  context = null;

  soundSources = {};

  buffers = [];

  constructor(buffersToLoad = BUFFERS_TO_LOAD, oldColors = {}) {
    this.context = this.createContext();
    this.isLoaded = this.loadBuffers(buffersToLoad).then();
    this.oldColors = oldColors;
  }

  isLoaded = () => this.isLoaded;

  createContext = function () {
    try {
      // Fix up for prefixing
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      return new AudioContext();
    } catch (e) {
      throw new Error('Web Audio API is not supported in this browser');
    }
  }

  loadBuffers = function (buffersToLoad) {
    // Array-ify
    const names = [];
    const paths = [];

    R.keys(buffersToLoad).forEach((name) => {
      const path = buffersToLoad[name];
      names.push(name);
      paths.push(path);
    });
    return new Promise((resolve, reject) => {
      const bufferLoader = new BufferLoader(this.context, paths, ((bufferList) => {
        for (let i = 0; i < bufferList.length; i++) {
          const buffer = bufferList[i];
          const name = names[i];
          this.buffers.push({
            name,
            buffer,
            props: {
              color: this.oldColors[name] || ColorPalette[i].color.background
            }
          });
        }
        resolve();
      }));
      bufferLoader.load();
    });
  }

  addAudioFile = fileData => new Promise((resolve) => {
    this.context.decodeAudioData(fileData.buffer, (buffer) => {
      this.buffers.push({
        name: fileData.name,
        buffer,
        props: {
          color: this.oldColors[fileData.name] || ColorPalette[this.buffers.length].color.background
        }
      });
      resolve();
    });
  })

  getBuffers = () => this.buffers;

  getSoundNames = () => this.buffers.map(R.prop('name'));

  startSounds(soundList) {
    soundList.forEach(this.startSound);
  }

  startSound = (soundName) => {
    let ctl = this.soundSources[soundName];
    if (!ctl) {
      ctl = this.createSource(soundName);
      this.soundSources[soundName] = ctl;
      if (!ctl.source.start) {
        ctl.source.noteOn(0);
      } else {
        ctl.source.start(0);
      }
    }
  }

  createSource = (soundName) => {
    const bufferInfo = this.buffers.find(bufferInfo2 => bufferInfo2.name === soundName);
    const { buffer } = bufferInfo;
    // if (!buffer) {
    //   buffer = BUFFERS[soundName];
    // }
    // if (!context) {
    //   context = localContext;
    // }
    const source = this.context.createBufferSource();
    const gainNode = this.context.createGain ? this.context.createGain() : this.context.createGainNode();
    source.buffer = buffer;
    // Turn on looping
    source.loop = true;
    // Connect source to gain.
    source.connect(gainNode);
    // Connect gain to destination.
    gainNode.connect(this.context.destination);

    return {
      source,
      gainNode
    };
  }

  removeSound = (soundName) => {
    this.stopSound();
    this.buffers = this.buffers.filter(bufferInfo2 => bufferInfo2.name !== soundName);
  }

  stopSound = (soundName) => {
    const ctl = this.soundSources[soundName];
    if (!ctl) return;
    if (!ctl.source.stop) {
      ctl.source.noteOff(0);
    } else {
      ctl.source.stop(0);
    }
    delete this.soundSources[soundName];
  }

  stopSounds = () => {
    R.keys(this.soundSources).forEach(this.stopSound);
  }

  applyVolumes = (volumes) => {
    volumes.forEach((volumeData) => {
      const source = (this.soundSources[volumeData.name]);
      if (!source) {
        this.startSound(volumeData.name);
      }
    });
    volumes.forEach(volumeData => (this.soundSources[volumeData.name].gainNode.gain.value = volumeData.gain));
  }

  toJson = () => this.buffers.map(bufferInfo => ({
    name: bufferInfo.name,
    props: bufferInfo.props
    // ...bufferInfo,
    // buffer: this.ab2b64(bufferInfo.buffer)
  }))

  fromJson = (data) => {
    console.log('555');
    data.map(bufferInfo => ({
      name: bufferInfo.name,
      props: bufferInfo.props
    }));
  }

  getSoundProps = (soundName) => {
    const buffer = this.buffers.find(bufferInfo2 => bufferInfo2.name === soundName);
    if (buffer) {
      // console.log(soundName, 'buffer.props', buffer.props);
      return buffer.props;
    }
    return {};
  }

  ab2b64(buf) {
    return btoa(
      new Uint8Array(buf)
        .reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
  }

  b642ab(base64) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
}
