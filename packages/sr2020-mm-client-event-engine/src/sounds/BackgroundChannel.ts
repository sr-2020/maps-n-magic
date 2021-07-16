import { SoundSettings, SoundStageState } from "sr2020-mm-event-engine";
import { SoundCtl } from "../types";
import { AudioContextWrapper } from "./AudioContextWrapper";
import { ctlStart, ctlStop } from "./ctlUtils";
import { SoundStorage } from "./SoundStorage";

let counter = 1;

const BG_SILENCE_DURATION_MILLIS = 5000;

interface BackgroundChannelContext {
  soundStageState: SoundStageState;
  props: {
    soundSettings: SoundSettings;
    soundStorage: SoundStorage;
    audioContextWrapper: AudioContextWrapper;
  },
  setCurBgSoundData: (data: string) => void;
}

export class BackgroundChannel {
  soundCtl: SoundCtl | null = null;

  bgSilenceTimeoutId: NodeJS.Timeout | null = null;

  uid: number;

  disposed: boolean = false;

  mute: boolean = false;

  constructor(private context: BackgroundChannelContext) {
    this.uid = counter;
    counter++;
    this.run = this.run.bind(this);
  }

  setMute (mute: boolean): void {
    this.mute = mute;
    if (this.soundCtl === null) {
      return;
    }
    if (mute) {
      this.soundCtl.gainNode.gain.value = 0;
    } else {
      this.soundCtl.gainNode.gain.value = this.soundCtl.originalVolumePercent / 100;
    }
  }

  run() {
    if (this.disposed) return;
    console.log(`${this.uid} RotationChannel.run`);
    const { backgroundSound } = this.context.soundStageState;
    const { soundSettings, soundStorage, audioContextWrapper } = this.context.props;
    if (backgroundSound === null) {
      this.bgSilenceTimeoutId = setTimeout(() => this.run(), BG_SILENCE_DURATION_MILLIS);
      this.context.setCurBgSoundData(JSON.stringify({
        type: 'silence', 
        durationMillis: BG_SILENCE_DURATION_MILLIS
      }, null, '  '));
    } else {
      const sound = soundStorage.getSound(backgroundSound.name);
      if ( sound === undefined ) {
        console.warn(`BackgroundChannel sound not found: ${backgroundSound.name}`);
        this.bgSilenceTimeoutId = setTimeout(() => this.run(), BG_SILENCE_DURATION_MILLIS);
        this.context.setCurBgSoundData(JSON.stringify({
          type: 'silence', 
          durationMillis: BG_SILENCE_DURATION_MILLIS
        }, null, '  '));
      } else {
        console.log(`start bg sound ${JSON.stringify(backgroundSound)}`);
        const ctl = audioContextWrapper.createSource(sound.buffer);
        this.soundCtl = ctl;
        ctl.source.addEventListener('ended', this.run);
        ctl.source.customData = { soundName: sound.name };

        if (this.mute) {
          ctl.gainNode.gain.value = 0;
        } else {
          ctl.gainNode.gain.value = backgroundSound.volumePercent / 100;
        }
        this.soundCtl.originalVolumePercent = backgroundSound.volumePercent;
        ctlStart(ctl);
        this.context.setCurBgSoundData(JSON.stringify({
          type: 'sound', 
          name: sound.name,
          volumePercent: backgroundSound.volumePercent,
          durationMillis: Math.round(sound.buffer.duration * 1000)
        }, null, '  '));
      }
    }
  }

  dispose() {
    console.log(`${this.uid} BackgroundChannel.dispose`);
    if (this.bgSilenceTimeoutId !== null) {
      clearTimeout(this.bgSilenceTimeoutId);
    }
    if (this.soundCtl) {
      ctlStop(this.soundCtl);
      this.soundCtl = null;
    }
    this.disposed = true;
  }
}