import * as R from 'ramda';

import { AbstractService } from '../core/AbstractService';

export class CharacterLocationService extends AbstractService {
  metadata = {
    actions: [
      'setAllCharacterLocations',
      'setCharacterLocation',
    ],
    requests: [],
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

  setCharacterLocation({ characterId, locationId, prevLocationId }) {
    const prevLocationId2 = this.char2locIndex.get(characterId);
    if (prevLocationId2 === locationId) {
      return;
    }
    this.char2locIndex.set(characterId, locationId);
    let locData = this.loc2charIndex.get(locationId);
    if (!locData) {
      this.loc2charIndex.set(locationId, new Set());
      locData = this.loc2charIndex.get(locationId);
    }
    locData.add(characterId);
    // this.logger.info({ characterId, locationId, prevLocationId });
    this.emit('characterLocationChanged', {
      type: 'characterLocationChanged',
      locationId,
      characterId,
      prevLocationId,
    });
  }
}
