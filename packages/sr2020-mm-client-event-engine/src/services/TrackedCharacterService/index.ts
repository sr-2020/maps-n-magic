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
  trackedCharacterId: number | null;
  locationId: number | null;

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(trackedCharacterMetadata);
    this.trackedCharacterId = null;
    this.locationId = null;
    this.onLocationRecordsChanged2 = this.onLocationRecordsChanged2.bind(this);
  }

  init() {
    super.init();
    this.on2('locationRecordsChanged2', this.onLocationRecordsChanged2);
  }

  dispose() {
    this.off2('locationRecordsChanged2', this.onLocationRecordsChanged2);
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
    return this.trackedCharacterId;
  }

  getTrackedCharacterLocationId(arg: Req<GetTrackedCharacterLocationId>): Res<GetTrackedCharacterLocationId> {
    return this.locationId;
  }

  setTrackedCharacterId({ trackedCharacterId }: SetTrackedCharacterId) {
    this.trackedCharacterId = trackedCharacterId;
    if (trackedCharacterId === null) {
      this.locationId = null;
    } else {
      const userRecord = this.getFromModel2({
        type: 'userRecord',
        id: trackedCharacterId
      });
      this.locationId = userRecord?.location_id || null;
    }
    this.emit2({
      type: 'trackedCharacterIdChanged',
      trackedCharacterId,
    });
    this.emit2({
      type: 'trackedCharacterLocationChanged',
      trackedCharacterId,
      trackedCharacterLocationId: this.locationId,
    });
    if (this.trackedCharacterId !== null) {
      // this.emit2({
      //   type: 'emitTrackedCharacterLocationChanged',
      //   trackedCharacterId: this.trackedCharacterId,
      // });
    } else {
      // this.executeOnModel({
      //   type: 'setBackgroundSound',
      //   name: null,
      // });
    }
  }

  trackedCharacterLocationChanged(data: TrackedCharacterLocationChanged) {
    if (this.trackedCharacterId === null) {
      return;
    }
    const { locationId, trackedCharacterId } = data;
    if (this.trackedCharacterId === trackedCharacterId) {
      this.logger.info('onCharacterLocationChanged', data);
      this.locationId = locationId;
      this.emit2({
        type: 'trackedCharacterLocationChanged',
        trackedCharacterId,
        trackedCharacterLocationId: locationId,
      });
      this.updateBackgroundSound(locationId);
    }
  }

  private updateBackgroundSound(locationId: number | null) {
    const locationRecord = locationId !== null ? this.getLocation(locationId) : null;
    if (locationRecord && locationRecord.options.manaLevel) {
      const { manaLevel } = locationRecord.options;
      // const soundName = this.getFromModel({
      //   type: 'soundForKey',
      //   keyType: 'manaLevels',
      //   // eslint-disable-next-line no-nested-ternary
      //   key: manaLevel < 3 ? 'low'
      //     : (manaLevel < 5 ? 'normal' : 'high'),
      // });
      // this.executeOnModel({
      //   type: 'setBackgroundSound',
      //   name: soundName,
      // });
    } else {
      // this.executeOnModel({
      //   type: 'setBackgroundSound',
      //   name: null,
      // });
    }
  }

  private getLocation(locationId: number): LocationRecord | null {
    return this.getFromModel2({
      type: 'locationRecord',
      id: locationId,
    });
  }
}
