import * as R from 'ramda';

import { 
  AbstractService, 
  Metadata, 
  LocationRecord, 
  GameModel, 
  GMLogger,
  Req,
  Res
} from 'sr2020-mm-event-engine';

import { 
  characterWatchMetadata,
  GetCharacterId,
  GetCharacterLocationId,
  SetCharacterId,
  CharacterLocationChanged,
  CharacterWatchEvents
} from "./types";

export class CharacterWatchService extends AbstractService<CharacterWatchEvents> {
  characterId: number | null;
  locationId: number | null;

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(characterWatchMetadata);
    this.characterId = null;
    this.locationId = null;
    this.onLocationRecordsChanged2 = this.onLocationRecordsChanged2.bind(this);
  }

  init() {
    super.init();
    this.on('locationRecordsChanged2', this.onLocationRecordsChanged2);
  }

  dispose() {
    this.off('locationRecordsChanged2', this.onLocationRecordsChanged2);
  }

  // it is strange that it unconditionally updates background sound
  // Seems we should check type of change.
  onLocationRecordsChanged2(data) {
    // this.logger.info('onLocationRecordsChanged2', data);
    if (this.locationId) {
      this.updateBackgroundSound(this.locationId);
    }
  }

  getCharacterId(arg: Req<GetCharacterId>): Res<GetCharacterId> {
    return this.characterId;
  }

  getCharacterLocationId(arg: Req<GetCharacterLocationId>): Res<GetCharacterLocationId> {
    return this.locationId;
  }

  setCharacterId({ characterId }: SetCharacterId) {
    this.characterId = characterId;
    this.locationId = null;
    this.emit2({
      type: 'characterIdChanged',
      characterId,
    });
    this.emit2({
      type: 'characterLocationChanged',
      characterId,
      characterLocationId: this.locationId,
    });
    if (this.characterId !== null) {
      this.emit2({
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

  characterLocationChanged(data: CharacterLocationChanged) {
    if (this.characterId === null) {
      return;
    }
    const { locationId, characterId } = data;
    if (this.characterId === characterId) {
      this.logger.info('onCharacterLocationChanged', data);
      this.locationId = locationId;
      this.emit2({
        type: 'characterLocationChanged',
        characterId,
        characterLocationId: locationId,
      });
      this.updateBackgroundSound(locationId);
    }
  }

  private updateBackgroundSound(locationId) {
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

  private getLocation(locationId: number): LocationRecord {
    return this.getFromModel({
      type: 'locationRecord',
      id: locationId,
    });
  }
}
