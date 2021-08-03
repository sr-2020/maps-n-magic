import * as R from 'ramda';

import { 
  AbstractService, 
  GameModel, 
  GMLogger,
  Req,
  Res,
  Rotation,
  TrackData
} from 'sr2020-mm-event-engine';

import { 
  soundStageMetadata,
  GetSoundStageState,
  SetBackgroundSound,
  SetRotationSounds,
  ClearSoundStage,
  SoundStageServiceContract
} from "./types";

export class SoundStageService extends AbstractService<SoundStageServiceContract> {
  backgroundSound: TrackData | null;
  rotationSounds: Rotation | null;

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(soundStageMetadata);
    this.backgroundSound = null;
    this.rotationSounds = null;
  }

  emitSoundStageChanged() {
    this.emit2({
      type: 'soundStageStateChanged',
      soundStageState: {
        backgroundSound: this.backgroundSound,
        rotationSounds: R.clone(this.rotationSounds),
      }
    });
  }

  setBackgroundSound({ trackData }: SetBackgroundSound) {
    this.backgroundSound = R.clone(trackData);
    this.emitSoundStageChanged();
  }

  setRotationSounds({ rotation }: SetRotationSounds) {
    this.rotationSounds = R.clone(rotation);
    this.emitSoundStageChanged();
  }

  clearSoundStage(arg: ClearSoundStage) {
    const hasBackgroundSound = !!this.backgroundSound;
    let hasChanges = false;
    if (hasBackgroundSound) {
      this.backgroundSound = null;
      hasChanges = true;
    }
    const { rotationSounds } = this;
    const hasRotationSounds = rotationSounds !== null && rotationSounds.tracks.length !== 0;
    if (hasRotationSounds) {
      this.rotationSounds = null;
      hasChanges = true;
    }
    if (hasChanges) {
      this.emitSoundStageChanged();
    }
  }

  getSoundStageState(arg: Req<GetSoundStageState>): Res<GetSoundStageState> {
    return {
      backgroundSound: this.backgroundSound,
      rotationSounds: R.clone(this.rotationSounds),
    };
  }
}
