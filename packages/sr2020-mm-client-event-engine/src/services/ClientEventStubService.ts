import { AbstractService, Metadata } from 'sr2020-mm-event-engine';

const metadata: Metadata = {
  actions: [
    'wipeManaOceanEffects',
    'removeManaEffect',
    'addManaEffect',
  ],
  requests: [],
  emitEvents: [
    'wipeManaOceanEffects',
    'removeManaEffect',
    'addManaEffect',
  ],
  needActions: [],
  needRequests: [],
  listenEvents: [],
};
export class ClientEventStubService extends AbstractService {

  constructor() {
    super();
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
