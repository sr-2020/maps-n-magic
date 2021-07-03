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
  TrackData
} from 'sr2020-mm-event-engine';

// requests

export type GetSoundStageState = (arg: Typed<'soundStageState'>) => SoundStageState;

// actions

export type SetBackgroundSound = Typed<'setBackgroundSound', {
  trackData: TrackData | null;
}>;
export type ClearSoundStage = Typed<'clearSoundStage'>;
export type RotationSoundsChange = Typed<'rotationSoundsChange', {
  added: TrackData[];
  removed: TrackData[];
}>;

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
    | RotationSoundsChange
    | ClearSoundStage
  EmitEvent: SoundStageEvents;
  ListenEvent: never;
  NeedAction: never;
  NeedRequest: never;
}

export const soundStageMetadata: ServiceContractTypes<SoundStageServiceContract> = {
  requests: ['soundStageState'],
  actions: [
    'setBackgroundSound',
    'rotationSoundsChange',
    'clearSoundStage',
  ],
  emitEvents: [
    'soundStageStateChanged'
  ],
  needActions: [],
  needRequests: [],
  listenEvents: []
};