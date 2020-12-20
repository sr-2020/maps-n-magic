import * as R from 'ramda';

import { AbstractService } from 'sr2020-mm-event-engine/core/AbstractService';

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
      'setBackgroundSound',
    ],
    listenEvents: [
      'locationRecordsChanged2',
    ],
  };

  constructor(...args) {
    super(...args);
    this.characterId = null;
    this.locationId = null;
    this.onLocationRecordsChanged2 = this.onLocationRecordsChanged2.bind(this);
  }

  init(gameModel) {
    super.init(gameModel);
    this.on('locationRecordsChanged2', this.onLocationRecordsChanged2);
  }

  dispose() {
    this.off('locationRecordsChanged2', this.onLocationRecordsChanged2);
  }

  onLocationRecordsChanged2(data) {
    // this.logger.info('onLocationRecordsChanged2', data);
    if (this.locationId) {
      this.updateBackgroundSound(this.locationId);
    }
  }

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
    } else {
      this.executeOnModel({
        type: 'setBackgroundSound',
        name: null,
      });
    }
  }

  characterLocationChanged(data) {
    if (this.characterId === null) {
      return;
    }
    const { locationId, characterId } = data;
    if (this.characterId === characterId) {
      this.logger.info('onCharacterLocationChanged', data);
      this.locationId = locationId;
      this.emit('characterLocationChanged', {
        type: 'characterLocationChanged',
        characterId,
        characterLocationId: locationId,
      });
      this.updateBackgroundSound(locationId);
    }
  }

  updateBackgroundSound(locationId) {
    const locationRecord = this.getLocation(locationId);
    if (locationRecord) {
      const { manaLevel } = locationRecord.options;
      const soundName = this.getFromModel({
        type: 'soundForKey',
        keyType: 'manaLevels',
        // eslint-disable-next-line no-nested-ternary
        key: manaLevel < 3 ? 'low'
          : (manaLevel < 5 ? 'normal' : 'high'),
      });
      this.executeOnModel({
        type: 'setBackgroundSound',
        name: soundName,
      });
    } else {
      this.executeOnModel({
        type: 'setBackgroundSound',
        name: null,
      });
    }
  }

  getLocation(locationId) {
    return this.getFromModel({
      type: 'locationRecord',
      id: locationId,
    });
  }
}
