import * as R from 'ramda';

import { 
  AbstractService, 
  Metadata, 
  GameModel, 
  GMLogger,
  Typed,
  TypeOnly,
  Req,
  Res
} from '../../core';

const moeMetadata: Metadata = {
  actions: [
    'setEnableManaOcean',
    'enableManaOceanConfirmed',
    // 'enableManaOceanChanged',
  ],
  requests: [
    'enableManaOcean',
  ],
  emitEvents: [
    'enableManaOceanRequested',
    'enableManaOceanChanged',
  ],
  needActions: [],
  needRequests: [],
  listenEvents: [],
};

export interface SetEnableManaOceanArgs {
  enableManaOcean: boolean
}

export type SetEnableManaOcean = Typed<'setEnableManaOcean', SetEnableManaOceanArgs>;
export type EnableManaOceanConfirmed = Typed<'enableManaOceanConfirmed', SetEnableManaOceanArgs>;
// export type EnableManaOceanChanged = Typed<'enableManaOceanChanged', SetEnableManaOceanArgs>;

export type GetEnableManaOcean = (arg: TypeOnly<'enableManaOcean'>) => boolean;

export type EEnableManaOceanRequested = Typed<'enableManaOceanRequested', SetEnableManaOceanArgs>;
export type EEnableManaOceanChanged = Typed<'enableManaOceanChanged', SetEnableManaOceanArgs>;

export type EnableManaOceanEvents = EEnableManaOceanRequested |
  EEnableManaOceanChanged;


export class ManaOceanEnableService extends AbstractService<EnableManaOceanEvents> {
  enableManaOcean: boolean;

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(moeMetadata);
    this.enableManaOcean = true;
  }

  getEnableManaOcean(request: Req<GetEnableManaOcean>): Res<GetEnableManaOcean> {
    return this.enableManaOcean;
  }

  setEnableManaOcean(action: SetEnableManaOcean): void {
    const { enableManaOcean } = action;
    if (this.enableManaOcean === enableManaOcean) {
      return;
    }
    this.emit2({
      ...action,
      type: 'enableManaOceanRequested'
    });
  }

  enableManaOceanConfirmed({ enableManaOcean }: EnableManaOceanConfirmed): void {
    if (this.enableManaOcean === enableManaOcean) {
      return;
    }
    this.enableManaOcean = enableManaOcean;
    this.emit2({
      type: 'enableManaOceanChanged',
      enableManaOcean,
    });
  }
}
