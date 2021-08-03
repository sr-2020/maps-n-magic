import * as R from 'ramda';

import { 
  AbstractService, 
  GameModel, 
  GMLogger,
  Req,
  Res
} from 'sr2020-mm-event-engine';

import { 
  soundSettingsMetadata,
  SetBackgroundVolume,
  SetRotationSoundTimeout,
  SetRotationTimeout,
  SetRotationVolume,
  SoundSettingsServiceContract,
  GetSoundSettings
} from "./types";

export class SoundSettingsService extends AbstractService<SoundSettingsServiceContract> {
  rotationTimeout: number;
  rotationSoundTimeout: number;
  backgroundVolume: number;
  rotationVolume: number;

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(soundSettingsMetadata);
    this.rotationTimeout = 2000;
    this.rotationSoundTimeout = 5000;
    this.backgroundVolume = 50;
    this.rotationVolume = 50;
  }

  emitSoundSettingsChanged() {
    this.emit2({
      type: 'soundSettingsChanged',
      soundSettings: {
        rotationTimeout: this.rotationTimeout,
        rotationSoundTimeout: this.rotationSoundTimeout,
        backgroundVolume: this.backgroundVolume,
        rotationVolume: this.rotationVolume,
      }
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
    this.emitSoundSettingsChanged();
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
    this.emitSoundSettingsChanged();
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
    this.emitSoundSettingsChanged();
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
    this.emitSoundSettingsChanged();
  }

  getSoundSettings(arg: Req<GetSoundSettings>): Res<GetSoundSettings> {
    return {
      rotationTimeout: this.rotationTimeout,
      rotationSoundTimeout: this.rotationSoundTimeout,
      backgroundVolume: this.backgroundVolume,
      rotationVolume: this.rotationVolume,
    };
  }
}
