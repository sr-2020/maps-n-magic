import { AbstractService } from 'sr2020-mm-event-engine/core/AbstractService';

const metadata = {
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
export class ClientEventStubService extends AbstractService {

  constructor(logger) {
    super(logger);
    this.setMetadata(metadata);
  }
  
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
