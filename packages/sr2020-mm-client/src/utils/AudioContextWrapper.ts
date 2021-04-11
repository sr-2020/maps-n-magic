import { SoundCtl } from "../types";

export class AudioContextWrapper {
  context: AudioContext;

  constructor() {
    this.context = createContext();
  }

  makeAudioBuffer(buffer: ArrayBuffer): Promise<AudioBuffer> {
    return this.context.decodeAudioData(buffer);
  }

  createSource = (buffer: AudioBuffer): SoundCtl => {
    // const bufferInfo = this.buffers.find((bufferInfo2) => bufferInfo2.name === soundName);
    // const { buffer } = bufferInfo;
    // if (!buffer) {
    //   buffer = BUFFERS[soundName];
    // }
    // if (!context) {
    //   context = localContext;
    // }
    const source = this.context.createBufferSource();
    // const gainNode = this.context.createGain ? this.context.createGain() : this.context.createGainNode();
    const gainNode = this.context.createGain();
    source.buffer = buffer;
    // Turn on looping
    // source.loop = true;
    // Connect source to gain.
    source.connect(gainNode);
    // Connect gain to destination.
    gainNode.connect(this.context.destination);

    return {
      source,
      gainNode,
    };
  }
}

export function createContext() {
  try {
    // Fix up for prefixing
    // window.AudioContext = window.AudioContext || window.webkitAudioContext;
    window.AudioContext = window.AudioContext;
    return new AudioContext();
  } catch (e) {
    throw new Error('Web Audio API is not supported in this browser');
  }
}
