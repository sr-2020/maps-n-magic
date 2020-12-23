import * as R from 'ramda';

import { AbstractService } from '../core/AbstractService';

export class ManaOceanEnableService extends AbstractService {
  metadata = {
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

  constructor() {
    super();
    this.enableManaOcean = true;
  }

  getEnableManaOcean() {
    return this.enableManaOcean;
  }

  setEnableManaOcean(action) {
    const { enableManaOcean } = action;
    if (this.enableManaOcean === enableManaOcean) {
      return;
    }
    this.emit('enableManaOceanRequested', action);
  }

  enableManaOceanConfirmed({ enableManaOcean }) {
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
