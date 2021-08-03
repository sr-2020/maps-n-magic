import { 
  AbstractService, 
  Metadata, 
  GameModel, 
  GMLogger,
  SoundStageState,
  TypeOnly,
  Typed,
  ServiceContract,
  ServiceContractTypes,
  TrackData,
  Rotation
} from 'sr2020-mm-event-engine';

// requests

export type GetSoundStageState = (arg: Typed<'soundStageState'>) => SoundStageState;

// actions

export type SetBackgroundSound = Typed<'setBackgroundSound', {
  trackData: TrackData | null;
}>;
export type SetRotationSounds = Typed<'setRotationSounds', {
  rotation: Rotation | null;
}>;
export type ClearSoundStage = Typed<'clearSoundStage'>;

// events

export type ESoundStageStateChanged = Typed<'soundStageStateChanged', {
  soundStageState: SoundStageState;
}>;

export type SoundStageEvents = 
  | ESoundStageStateChanged
;

export interface SoundStageServiceContract extends ServiceContract {
  Request: GetSoundStageState;
  Action: 
    | SetBackgroundSound
    | ClearSoundStage
    | SetRotationSounds;
  EmitEvent: SoundStageEvents;
  ListenEvent: never;
  NeedAction: never;
  NeedRequest: never;
}

export const soundStageMetadata: ServiceContractTypes<SoundStageServiceContract> = {
  requests: ['soundStageState'],
  actions: [
    'setBackgroundSound',
    'clearSoundStage',
    'setRotationSounds'
  ],
  emitEvents: [
    'soundStageStateChanged'
  ],
  needActions: [],
  needRequests: [],
  listenEvents: []
};