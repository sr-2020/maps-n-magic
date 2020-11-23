import * as R from 'ramda';

import { AbstractService } from '../core/AbstractService';

export class CharacterLocationService extends AbstractService {
  metadata = {
    actions: [
      'setAllCharacterLocations',
      'setCharacterLocation',
    ],
    requests: [
      'charactersFromLocation',
    ],
    emitEvents: [
      'characterLocationChanged',
    ],
    listenEvents: [
    ],
    needRequests: [
    ],
  };

  constructor(...args) {
    super(...args);
    // Map(
    //   locationId,
    //   characterSet: Set(characterId)
    // )
    this.loc2charIndex = new Map();
    // Map(
    //   characterId,
    //   locationId
    // )
    this.char2locIndex = new Map();
    this.setCharacterLocation = this.setCharacterLocation.bind(this);
  }

  setAllCharacterLocations({ characterLocations }) {
    characterLocations.forEach(this.setCharacterLocation);

    // this.logger.info(characterLocations);
    // this.logger.info(this.loc2charIndex);
    // this.logger.info(this.char2locIndex);
  }

  getCharactersFromLocation({ locationId }) {
    return this.loc2charIndex.get(locationId) || new Set();
  }

  setCharacterLocation({ characterId, locationId, prevLocationId }) {
    const prevLocationId2 = this.char2locIndex.get(characterId);
    if (prevLocationId2 === locationId) {
      return;
    }
    this.char2locIndex.set(characterId, locationId);
    const prevLocData = this.loc2charIndex.get(prevLocationId);
    if (prevLocData) {
      prevLocData.delete(characterId);
    }
    let curLocData = this.loc2charIndex.get(locationId);
    if (!curLocData) {
      this.loc2charIndex.set(locationId, new Set());
      curLocData = this.loc2charIndex.get(locationId);
    }
    curLocData.add(characterId);
    // this.logger.info('loc2charIndex', this.loc2charIndex);
    // this.logger.info('char2locIndex', this.char2locIndex);
    // this.logger.info({ characterId, locationId, prevLocationId });
    this.emit('characterLocationChanged', {
      type: 'characterLocationChanged',
      locationId,
      characterId,
      prevLocationId,
    });
  }
}
