import * as R from 'ramda';

import { 
  AbstractService, 
  GameModel, 
  GMLogger,
  Req,
  Res
} from 'sr2020-mm-event-engine';

import { 
  soundStageMetadata,
  GetSoundStageState,
  SetBackgroundSound,
  ClearSoundStage,
  RotationSoundsChange,
  SoundStageServiceContract
} from "./types";

export class SoundStageService extends AbstractService<SoundStageServiceContract> {
  backgroundSound: string | null;
  rotationSounds: string[];

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(soundStageMetadata);
    this.backgroundSound = null;
    this.rotationSounds = [];
  }

  emitSoundStageChanged() {
    this.emit2({
      type: 'soundStageStateChanged',
      soundStageState: {
        backgroundSound: this.backgroundSound,
        rotationSounds: [...this.rotationSounds],
      }
    });
  }

  setBackgroundSound({ name }: SetBackgroundSound) {
    this.backgroundSound = name;
    this.emitSoundStageChanged();
  }

  clearSoundStage(arg: ClearSoundStage) {
    const hasBackgroundSound = !!this.backgroundSound;
    let hasChanges = false;
    if (hasBackgroundSound) {
      this.backgroundSound = null;
      hasChanges = true;
    }
    const hasRotationSounds = this.rotationSounds.length !== 0;
    if (hasRotationSounds) {
      this.rotationSounds = [];
      hasChanges = true;
    }
    if (hasChanges) {
      this.emitSoundStageChanged();
    }
  }

  rotationSoundsChange({ added = [], removed = [] }: RotationSoundsChange) {
    const sounds = R.difference(this.rotationSounds, removed).concat(added);
    if (R.symmetricDifference(this.rotationSounds, sounds).length !== 0) {
      this.rotationSounds = sounds;
      this.emitSoundStageChanged();
    }
  }

  getSoundStageState(arg: Req<GetSoundStageState>): Res<GetSoundStageState> {
    return {
      backgroundSound: this.backgroundSound,
      rotationSounds: [...this.rotationSounds],
    };
  }
}
