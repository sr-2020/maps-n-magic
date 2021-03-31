import * as R from 'ramda';

import { 
  AbstractService, 
  Metadata,
  GMLogger,
  GameModel,
  CharacterLocationData,
  Req,
  Res
} from 'sr2020-mm-event-engine';

import { 
  clMetadata,
  GetCharactersFromLocation,
  SetAllCharacterLocations,
  SetCharacterLocation,
  EmitCharacterLocationChanged,
  CharacterLocationEvents
} from "./types";

export class CharacterLocationService extends AbstractService<CharacterLocationEvents> {
  // Map(
  //   locationId,
  //   characterSet: Set(characterId)
  // )
  loc2charIndex: Map<number, Set<number>>;

  // Map(
  //   characterId,
  //   locationId
  // )
  char2locIndex: Map<number, number | null>;

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(clMetadata);
    this.loc2charIndex = new Map();
    this.char2locIndex = new Map();
    this.setCharacterLocation = this.setCharacterLocation.bind(this);
  }

  setAllCharacterLocations({ characterLocations }: SetAllCharacterLocations): void {
    characterLocations.forEach(el => this.setCharacterLocation({
      type: 'setCharacterLocation',
      ...el
    }));

    // this.logger.info(characterLocations);
    // this.logger.info(this.loc2charIndex);
    // this.logger.info(this.char2locIndex);
  }

  getCharactersFromLocation(request: Req<GetCharactersFromLocation>): Res<GetCharactersFromLocation> {
    const { locationId } = request;
    return this.loc2charIndex.get(locationId) || new Set();
  }

  setCharacterLocation({ characterId, locationId, prevLocationId }: SetCharacterLocation): void {
    const prevLocationId2 = this.char2locIndex.get(characterId);
    if (prevLocationId2 === locationId) {
      return;
    }
    this.char2locIndex.set(characterId, locationId);
    const prevLocData = prevLocationId !== null ? this.loc2charIndex.get(prevLocationId) : null;
    if (prevLocData) {
      prevLocData.delete(characterId);
    }
    if (typeof locationId === 'number') {
      let curLocData = locationId !== null ? this.loc2charIndex.get(locationId) : undefined;
      if (curLocData === undefined) {
        curLocData = new Set();
        this.loc2charIndex.set(locationId, curLocData);
      }
      curLocData.add(characterId);
    }
    // this.logger.info('loc2charIndex', this.loc2charIndex);
    // this.logger.info('char2locIndex', this.char2locIndex);
    // this.logger.info({ characterId, locationId, prevLocationId });
    this.emit2({
      type: 'characterLocationChanged',
      locationId,
      characterId,
      prevLocationId,
    });
  }

  emitCharacterLocationChanged({ characterId }: EmitCharacterLocationChanged): void {
    this.emit2({
      type: 'characterLocationChanged',
      locationId: this.char2locIndex.get(characterId) || null,
      characterId,
      prevLocationId: null,
    });
  }
}
