import * as R from 'ramda';

import { 
  AbstractService, 
  Metadata, 
  GameModel, 
  GMLogger 
} from '../core';

const metadata: Metadata = {
  actions: [
    'setEnableManaOcean',
    'enableManaOceanConfirmed',
    'enableManaOceanChanged',
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

export class ManaOceanEnableService extends AbstractService {
  enableManaOcean: boolean;

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(metadata);
    this.enableManaOcean = true;
  }

  getEnableManaOcean(): boolean {
    return this.enableManaOcean;
  }

  setEnableManaOcean(action: { enableManaOcean: boolean }): void {
    const { enableManaOcean } = action;
    if (this.enableManaOcean === enableManaOcean) {
      return;
    }
    this.emit('enableManaOceanRequested', action);
  }

  enableManaOceanConfirmed({ enableManaOcean }: { enableManaOcean: boolean }): void {
    if (this.enableManaOcean === enableManaOcean) {
      return;
    }
    this.enableManaOcean = enableManaOcean;
    this.emit('enableManaOceanChanged', {
      type: 'enableManaOceanChanged',
      enableManaOcean,
    });
  }
}
