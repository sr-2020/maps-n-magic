import * as R from 'ramda';

import { AbstractService } from '../core/AbstractService';

export class CharacterWatchService extends AbstractService {
  metadata = {
    actions: [
      'setCharacterId',
    ],
    requests: [
      'characterId',
    ],
    emitEvents: [
      'characterIdChanged',
    ],
    listenEvents: [],
  };

  constructor(...args) {
    super(...args);
    this.characterId = null;
  }

  getCharacterId() {
    return this.characterId;
  }

  setCharacterId({ characterId }) {
    this.characterId = characterId;
    this.emit('characterIdChanged', {
      type: 'characterIdChanged',
      characterId,
    });
  }
}
