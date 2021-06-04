import * as R from 'ramda';

import { 
  AbstractService, 
  Metadata, 
  LocationRecord, 
  GameModel, 
  GMLogger,
  Req,
  Res,
  ELocationRecordsChanged2,
} from 'sr2020-mm-event-engine';

import { 
  trackedCharacterMetadata,
  GetTrackedCharacterId,
  GetTrackedCharacterLocationId,
  TrackedCharacterLocationChanged,
  SetTrackedCharacterId,
  TrackedCharacterEvents,
  TrackedCharacterServiceContract
} from "./types";

export class TrackedCharacterService extends AbstractService<TrackedCharacterServiceContract> {
  characterId: number | null;
  locationId: number | null;

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(trackedCharacterMetadata);
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
  onLocationRecordsChanged2(data: ELocationRecordsChanged2) {
    // this.logger.info('onLocationRecordsChanged2', data);
    if (this.locationId) {
      this.updateBackgroundSound(this.locationId);
    }
  }

  getTrackedCharacterId(arg: Req<GetTrackedCharacterId>): Res<GetTrackedCharacterId> {
    return this.characterId;
  }

  getTrackedCharacterLocationId(arg: Req<GetTrackedCharacterLocationId>): Res<GetTrackedCharacterLocationId> {
    return this.locationId;
  }

  setTrackedCharacterId({ characterId }: SetTrackedCharacterId) {
    this.characterId = characterId;
    this.locationId = null;
    this.emit2({
      type: 'trackedCharacterIdChanged',
      characterId,
    });
    this.emit2({
      type: 'trackedCharacterLocationChanged',
      characterId,
      characterLocationId: this.locationId,
    });
    if (this.characterId !== null) {
      this.emit2({
        type: 'emitTrackedCharacterLocationChanged',
        characterId: this.characterId,
      });
    } else {
      this.executeOnModel({
        type: 'setBackgroundSound',
        name: null,
      });
    }
  }

  trackedCharacterLocationChanged(data: TrackedCharacterLocationChanged) {
    if (this.characterId === null) {
      return;
    }
    const { locationId, characterId } = data;
    if (this.characterId === characterId) {
      this.logger.info('onCharacterLocationChanged', data);
      this.locationId = locationId;
      this.emit2({
        type: 'trackedCharacterLocationChanged',
        characterId,
        characterLocationId: locationId,
      });
      this.updateBackgroundSound(locationId);
    }
  }

  private updateBackgroundSound(locationId: number | null) {
    const locationRecord = locationId !== null ? this.getLocation(locationId) : null;
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
