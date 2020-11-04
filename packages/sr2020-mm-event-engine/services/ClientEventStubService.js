import { AbstractService } from '../core/AbstractService';

export class ClientEventStubService extends AbstractService {
  metadata = {
    actions: ['wipeManaOceanEffects'],
    emitEvents: [
      'wipeManaOceanEffects',
    ],
  };

  wipeManaOceanEffects() {
    this.emit('wipeManaOceanEffects', {
      type: 'wipeManaOceanEffects',
    });
  }
}
