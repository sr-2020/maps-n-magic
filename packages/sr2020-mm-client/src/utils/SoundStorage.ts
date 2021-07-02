import { getSound, SOUND_LIST } from "sr2020-mm-client-event-engine";
import { Sound } from "../types";
import { AudioContextWrapper } from "./AudioContextWrapper";

export class SoundStorage {
  soundIndex: Record<string, Sound> = {};

  abortController: AbortController = new AbortController();

  constructor(private audioContextWrapper: AudioContextWrapper) {
    SOUND_LIST.forEach((soundName) => this.loadSound(soundName));
  }

  async loadSound(name: string): Promise<void> {
    try {
      const arrayBuffer = await getSound(name, this.abortController);
      const decodedData = await this.audioContextWrapper.makeAudioBuffer(arrayBuffer);
      this.soundIndex[name] = {
        name,
        status: 'loaded',
        buffer: decodedData
      };
    } catch (error) {
      console.error(error);
    }
  }

  getSound(name: string): Sound | undefined {
    return this.soundIndex[name];
  }

  dispose(): void {
    this.abortController.abort();
  }
}