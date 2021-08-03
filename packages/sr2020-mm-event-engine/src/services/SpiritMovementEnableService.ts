import * as R from 'ramda';

import { 
  AbstractService, 
  Metadata, 
  GameModel, 
  GMLogger,
  Typed,
  TypeOnly,
  Req,
  Res,
  ServiceContract,
  ServiceContractTypes
} from '../core';


export interface SetEnableSpiritMovementArgs {
  enableSpiritMovement: boolean
}

export type SetEnableSpiritMovement = Typed<'setEnableSpiritMovement', SetEnableSpiritMovementArgs>;
// export type EnableSpiritMovementConfirmed = Typed<'enableSpiritMovementConfirmed', SetEnableSpiritMovementArgs>;
export type EEnableSpiritMovementConfirmed = Typed<'enableSpiritMovementConfirmed', SetEnableSpiritMovementArgs>;
// export type EnableSpiritMovementChanged = Typed<'enableSpiritMovementChanged', SetEnableSpiritMovementArgs>;

export type GetEnableSpiritMovement = (arg: TypeOnly<'enableSpiritMovement'>) => boolean;

export type EEnableSpiritMovementRequested = Typed<'enableSpiritMovementRequested', SetEnableSpiritMovementArgs>;
export type EEnableSpiritMovementChanged = Typed<'enableSpiritMovementChanged', SetEnableSpiritMovementArgs>;

export interface SpiritMovementEnableServiceContract extends ServiceContract {
  Request: GetEnableSpiritMovement;
  Action: SetEnableSpiritMovement;
  EmitEvent: 
    | EEnableSpiritMovementRequested 
    | EEnableSpiritMovementChanged;
  ListenEvent: EEnableSpiritMovementConfirmed;
  NeedAction: never;
  NeedRequest: never;
}

const moeMetadata: ServiceContractTypes<SpiritMovementEnableServiceContract> = {
  actions: [
    'setEnableSpiritMovement',
    // 'enableSpiritMovementChanged',
  ],
  requests: [
    'enableSpiritMovement',
  ],
  emitEvents: [
    'enableSpiritMovementRequested',
    'enableSpiritMovementChanged',
  ],
  needActions: [],
  needRequests: [],
  listenEvents: [
    'enableSpiritMovementConfirmed',
  ],
};

// it is very similar to ManaOceanEnableService
export class SpiritMovementEnableService extends AbstractService<SpiritMovementEnableServiceContract> {
  enableSpiritMovement: boolean;

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(moeMetadata);
    this.enableSpiritMovement = true;
    this.enableSpiritMovementConfirmed = this.enableSpiritMovementConfirmed.bind(this);
  }

  init(): void {
    super.init();
    this.on2('enableSpiritMovementConfirmed', this.enableSpiritMovementConfirmed);
  }
  
  dispose(): void {
    this.off2('enableSpiritMovementConfirmed', this.enableSpiritMovementConfirmed);
  }

  getEnableSpiritMovement(request: Req<GetEnableSpiritMovement>): Res<GetEnableSpiritMovement> {
    return this.enableSpiritMovement;
  }

  setEnableSpiritMovement(action: SetEnableSpiritMovement): void {
    const { enableSpiritMovement } = action;
    if (this.enableSpiritMovement === enableSpiritMovement) {
      return;
    }
    this.emit2({
      ...action,
      type: 'enableSpiritMovementRequested'
    });
  }

  enableSpiritMovementConfirmed({ enableSpiritMovement }: EEnableSpiritMovementConfirmed): void {
    if (this.enableSpiritMovement === enableSpiritMovement) {
      return;
    }
    this.enableSpiritMovement = enableSpiritMovement;
    this.emit2({
      type: 'enableSpiritMovementChanged',
      enableSpiritMovement,
    });
  }
}
