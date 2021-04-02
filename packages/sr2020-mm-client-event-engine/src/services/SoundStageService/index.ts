import * as R from 'ramda';

import { 
  AbstractService, 
  Metadata, 
  GameModel, 
  GMLogger,
  Req,
  Res
} from 'sr2020-mm-event-engine';

import { 
  soundStageMetadata,
  GetSoundStage,
  SetBackgroundSound,
  SetBackgroundVolume,
  SetRotationSoundTimeout,
  SetRotationTimeout,
  SetRotationVolume,
  ClearSoundStage,
  RotationSoundsChange,
  SoundStageEvents
} from "./types";

export class SoundStageService extends AbstractService<SoundStageEvents> {
  backgroundSound: string | null;
  rotationSounds: string[];
  rotationTimeout: number;
  rotationSoundTimeout: number;
  backgroundVolume: number;
  rotationVolume: number;

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(soundStageMetadata);
    this.backgroundSound = null;
    this.rotationSounds = [];
    this.rotationTimeout = 2000;
    this.rotationSoundTimeout = 5000;
    this.backgroundVolume = 50;
    this.rotationVolume = 50;
  }

  // setData({ soundStageSettings = {} } = {}) {
  //   // @ts-ignore
  //   this.rotationTimeout = soundStageSettings.rotationTimeout || this.rotationTimeout;
  //   // @ts-ignore
  //   this.rotationSoundTimeout = soundStageSettings.rotationSoundTimeout || this.rotationSoundTimeout;
  //   // @ts-ignore
  //   this.backgroundVolume = soundStageSettings.backgroundVolume || this.backgroundVolume;
  //   // @ts-ignore
  //   this.rotationVolume = soundStageSettings.rotationVolume || this.rotationVolume;
  // }

  // getData() {
  //   return {
  //     soundStageSettings: {
  //       rotationTimeout: this.rotationTimeout,
  //       rotationSoundTimeout: this.rotationSoundTimeout,
  //       backgroundVolume: this.backgroundVolume,
  //       rotationVolume: this.rotationVolume,
  //     },
  //   };
  // }

  // dispose() {
  //   // this._stop();
  // }

  setBackgroundSound({ name }: SetBackgroundSound) {
    this.backgroundSound = name;
    this.emit2({
      type: 'backgroundSoundUpdate',
      backgroundSound: this.backgroundSound,
    });
  }

  setRotationTimeout({ rotationTimeout }: SetRotationTimeout) {
    if (!R.is(Number, rotationTimeout)) {
      return;
    }
    if (rotationTimeout < 0) {
      rotationTimeout = 0;
    }
    if (rotationTimeout > 30000) {
      rotationTimeout = 30000;
    }
    this.rotationTimeout = rotationTimeout;
    this.emit2({
      type: 'rotationTimeoutUpdate',
      rotationTimeout,
    });
  }

  setRotationSoundTimeout({ rotationSoundTimeout }: SetRotationSoundTimeout) {
    if (!R.is(Number, rotationSoundTimeout)) {
      return;
    }
    if (rotationSoundTimeout < 0) {
      rotationSoundTimeout = 0;
    }
    if (rotationSoundTimeout > 30000) {
      rotationSoundTimeout = 30000;
    }
    this.rotationSoundTimeout = rotationSoundTimeout;
    this.emit2({
      type: 'rotationSoundTimeoutUpdate',
      rotationSoundTimeout,
    });
  }

  setBackgroundVolume({ backgroundVolume }: SetBackgroundVolume) {
    if (!R.is(Number, backgroundVolume)) {
      return;
    }
    if (backgroundVolume < 0) {
      backgroundVolume = 0;
    }
    if (backgroundVolume > 100) {
      backgroundVolume = 100;
    }
    this.backgroundVolume = backgroundVolume;
    this.emit2({
      type: 'backgroundVolumeUpdate',
      backgroundVolume,
    });
  }

  setRotationVolume({ rotationVolume }: SetRotationVolume) {
    if (!R.is(Number, rotationVolume)) {
      return;
    }
    if (rotationVolume < 0) {
      rotationVolume = 0;
    }
    if (rotationVolume > 100) {
      rotationVolume = 100;
    }
    this.rotationVolume = rotationVolume;
    this.emit2({
      type: 'rotationVolumeUpdate',
      rotationVolume,
    });
  }

  clearSoundStage(arg: ClearSoundStage) {
    const hasBackgroundSound = !!this.backgroundSound;
    if (hasBackgroundSound) {
      this.backgroundSound = null;
      this.emit2({
        type: 'backgroundSoundUpdate',
        backgroundSound: this.backgroundSound,
      });
    }
    const hasRotationSounds = this.rotationSounds.length !== 0;
    if (hasRotationSounds) {
      this.rotationSounds = [];
      this.emit2({
        type: 'rotationSoundsUpdate',
        rotationSounds: this.rotationSounds,
      });
    }
  }

  rotationSoundsChange({ added = [], removed = [] }: RotationSoundsChange) {
    const sounds = R.difference(this.rotationSounds, removed).concat(added);
    if (R.symmetricDifference(this.rotationSounds, sounds).length !== 0) {
      this.rotationSounds = sounds;
      this.emit2({
        type: 'rotationSoundsUpdate',
        rotationSounds: this.rotationSounds,
      });
    }
  }

  getSoundStage(arg: Req<GetSoundStage>): Res<GetSoundStage> {
    return {
      backgroundSound: this.backgroundSound,
      rotationSounds: [...this.rotationSounds],
      rotationTimeout: this.rotationTimeout,
      rotationSoundTimeout: this.rotationSoundTimeout,
      backgroundVolume: this.backgroundVolume,
      rotationVolume: this.rotationVolume,
    };
  }
}
