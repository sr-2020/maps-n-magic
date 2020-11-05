import { AbstractService } from '../core/AbstractService';

export class ClientEventStubService extends AbstractService {
  metadata = {
    actions: [
      'wipeManaOceanEffects',
      'removeManaEffect',
    ],
    emitEvents: [
      'wipeManaOceanEffects',
      'removeManaEffect',
    ],
  };

  wipeManaOceanEffects() {
    this.emit('wipeManaOceanEffects', {
      type: 'wipeManaOceanEffects',
    });
  }

  removeManaEffect(data) {
    this.emit('removeManaEffect', {
      type: 'removeManaEffect',
      ...data,
    });
  }
}
