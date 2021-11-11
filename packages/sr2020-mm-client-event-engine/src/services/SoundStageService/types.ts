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

export type SetBackgroundSound = (arg: Typed<'setBackgroundSound', {
  trackData: TrackData | null;
}>) => void;
export type SetRotationSounds = (arg: Typed<'setRotationSounds', {
  rotation: Rotation | null;
}>) => void;
export type ClearSoundStage = (arg: Typed<'clearSoundStage'>) => void;

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