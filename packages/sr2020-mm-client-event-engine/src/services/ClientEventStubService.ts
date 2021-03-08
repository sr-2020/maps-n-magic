import { AbstractService, Metadata, GameModel, GMLogger } from 'sr2020-mm-event-engine';

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

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
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
