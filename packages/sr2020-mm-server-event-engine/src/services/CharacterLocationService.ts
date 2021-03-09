import * as R from 'ramda';

import { 
  AbstractService, 
  Metadata,
  GMLogger,
  GameModel,
  CharacterLocationData
} from 'sr2020-mm-event-engine';

const metadata: Metadata = {
  actions: [
    'setAllCharacterLocations',
    'setCharacterLocation',
    'emitCharacterLocationChanged',
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
  needActions: []
};
export class CharacterLocationService extends AbstractService {
  // Map(
  //   locationId,
  //   characterSet: Set(characterId)
  // )
  loc2charIndex: Map<number, Set<number>>;

  // Map(
  //   characterId,
  //   locationId
  // )
  char2locIndex: Map<number, number>;

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(metadata);
    this.loc2charIndex = new Map();
    this.char2locIndex = new Map();
    this.setCharacterLocation = this.setCharacterLocation.bind(this);
  }

  setAllCharacterLocations({ characterLocations }: {
    characterLocations: CharacterLocationData[]
  }): void {
    characterLocations.forEach(this.setCharacterLocation);

    // this.logger.info(characterLocations);
    // this.logger.info(this.loc2charIndex);
    // this.logger.info(this.char2locIndex);
  }

  getCharactersFromLocation({ locationId }): Set<number> {
    return this.loc2charIndex.get(locationId) || new Set();
  }

  setCharacterLocation({ characterId, locationId, prevLocationId }: CharacterLocationData): void {
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
    if (curLocData === undefined) {
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

  emitCharacterLocationChanged({ characterId }) {
    this.emit('characterLocationChanged', {
      type: 'characterLocationChanged',
      locationId: this.char2locIndex.get(characterId) || null,
      characterId,
      prevLocationId: null,
    });
  }
}
