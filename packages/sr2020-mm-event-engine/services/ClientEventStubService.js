import { AbstractService } from '../core/AbstractService';

export class ClientEventStubService extends AbstractService {
  metadata = {
    actions: [
      'wipeManaOceanEffects',
      'removeManaEffect',
      'addManaEffect',
    ],
    emitEvents: [
      'wipeManaOceanEffects',
      'removeManaEffect',
      'addManaEffect',
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

  addManaEffect(data) {
    this.emit('addManaEffect', {
      type: 'addManaEffect',
      ...data,
    });
  }
}
