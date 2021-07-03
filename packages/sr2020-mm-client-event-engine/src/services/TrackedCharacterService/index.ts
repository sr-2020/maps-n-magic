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
  ESpiritsChanged,
  Spirit,
  Rotation,
  TrackData,
  GetSpirits
} from 'sr2020-mm-event-engine';
import { FRACTION_SOUNDS, MANA_LEVEL_SOUNDS } from '../..';
import { SetBackgroundSound, SetRotationSounds } from '../SoundStageService/types';

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
    this.onSpiritsChanged = this.onSpiritsChanged.bind(this);
  }

  init() {
    super.init();
    this.on2('locationRecordsChanged2', this.onLocationRecordsChanged2);
    this.on2('spiritsChanged', this.onSpiritsChanged);
  }

  dispose() {
    this.off2('locationRecordsChanged2', this.onLocationRecordsChanged2);
    this.off2('spiritsChanged', this.onSpiritsChanged);
  }

  // it is strange that it unconditionally updates background sound
  // Seems we should check type of change.
  onLocationRecordsChanged2(data: ELocationRecordsChanged2) {
    // this.logger.info('onLocationRecordsChanged2', data);
    if (this.locationId === null) { return; }
    this.updateBackgroundSound(this.locationId);
  }

  onSpiritsChanged(data: ESpiritsChanged) {
    if (this.locationId === null) { return; }
    this.updateRotationSounds(this.locationId, this.gameModel.get2<GetSpirits>({type:'spirits'}));
  }
  
  updateRotationSounds(locationId: number | null, spirits: Spirit[]) {
    if (locationId === null) {
      // no location - no spirit sounds
      this.clearRotationSounds();
      return;
    }

    const locSpirits = spirits.reduce((acc: Spirit[], spirit) => {
      const { state } = spirit; 
      if (state.status === 'OnRoute') {
        const spiritLocationId = state.route.waypoints[state.waypointIndex];
        if (locationId === spiritLocationId) {
          acc.push(spirit);
        }
      }
      return acc;
    }, []);
  
    const tracks: TrackData[] = locSpirits.map(spirit => ({
      key: spirit.id,
      name: FRACTION_SOUNDS[spirit.fraction],
      volumePercent: 50
    }));
  
    this.executeOnModel2<SetRotationSounds>({
      type: 'setRotationSounds',
      rotation: {
        key: locationId,
        tracks
      }
    });
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
      this.updateBackgroundSound(this.locationId);
      this.updateRotationSounds(this.locationId, this.gameModel.get2<GetSpirits>({type:'spirits'}));
    } else {
      this.clearBgSound();
      this.clearRotationSounds();
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
      this.updateRotationSounds(locationId, this.gameModel.get2<GetSpirits>({type:'spirits'}));
    }
  }

  private updateBackgroundSound(locationId: number | null) {
    const locationRecord = locationId !== null ? this.getLocation(locationId) : null;
    if (locationRecord === null || locationRecord.options.manaLevel === undefined) {
      // no location - no background sound
      this.clearBgSound();
      return;
    }
    const { manaLevel } = locationRecord.options;
    const soundName = MANA_LEVEL_SOUNDS[manaLevel];
    if (soundName === undefined) {
      console.error(`manaLevel out of bounds. manaLevel ${manaLevel}, locationId ${locationId}`);
      this.clearBgSound();
    } else {
      this.executeOnModel2<SetBackgroundSound>({
        type: 'setBackgroundSound',
        trackData: {
          key: soundName,
          name: soundName,
          volumePercent: 50
        }
      });
    }
  }

  clearBgSound() {
    this.executeOnModel2<SetBackgroundSound>({
      type: 'setBackgroundSound',
      trackData: null,
    });
  }

  clearRotationSounds() {
    this.executeOnModel2<SetRotationSounds>({
      type: 'setRotationSounds',
      rotation: null
    });
  }

  private getLocation(locationId: number): LocationRecord | null {
    return this.getFromModel2({
      type: 'locationRecord',
      id: locationId,
    });
  }
}
