import * as R from 'ramda';

import { AbstractService } from '../core/AbstractService';

export class CharacterWatchService extends AbstractService {
  metadata = {
    actions: [
      'setCharacterId',
      // fictive event, actually it is emitted by CharacterLocationService
      'characterLocationChanged',
    ],
    requests: [
      'characterId',
      'characterLocationId',
    ],
    emitEvents: [
      'characterIdChanged',
      'emitCharacterLocationChanged',
      // fictive event, actually it is emitted by CharacterLocationService
      'characterLocationChanged',
    ],
    listenEvents: [
      // 'characterLocationChanged',
    ],
  };

  constructor(...args) {
    super(...args);
    this.characterId = null;
    this.locationId = null;
    // this.onCharacterLocationChanged = this.onCharacterLocationChanged.bind(this);
  }

  // init(gameModel) {
  //   super.init(gameModel);
  //   this.on('characterLocationChanged', this.onCharacterLocationChanged);
  // }

  // dispose() {
  //   this.off('characterLocationChanged', this.onCharacterLocationChanged);
  // }

  // onCharacterLocationChanged(data) {
  //   this.logger.info('onCharacterLocationChanged', data);
  // }

  getCharacterId() {
    return this.characterId;
  }

  getCharacterLocationId() {
    return this.locationId;
  }

  setCharacterId({ characterId }) {
    this.characterId = characterId;
    this.locationId = null;
    this.emit('characterIdChanged', {
      type: 'characterIdChanged',
      characterId,
    });
    this.emit('characterLocationChanged', {
      type: 'characterLocationChanged',
      characterId,
      characterLocationId: this.locationId,
    });
    if (this.characterId !== null) {
      this.emit('emitCharacterLocationChanged', {
        type: 'emitCharacterLocationChanged',
        characterId,
      });
    }
  }

  characterLocationChanged(data) {
    this.logger.info('onCharacterLocationChanged', data);
    if (this.characterId === null) {
      return;
    }
    const { locationId, characterId } = data;
    if (this.characterId === characterId) {
      this.locationId = locationId;
      this.emit('characterLocationChanged', {
        type: 'characterLocationChanged',
        characterId,
        characterLocationId: locationId,
      });
    }
  }
}
