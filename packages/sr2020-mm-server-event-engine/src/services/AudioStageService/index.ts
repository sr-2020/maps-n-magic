import * as R from 'ramda';

import { 
  AbstractService, 
  Metadata,
  LocationRecord,
  CharacterLocationData,
  GameModel,
  GMLogger,
  Typed,
  ServiceContract,
  ServiceContractTypes,
  ECharacterLocationChanged,
  EPutLocationRecords,
  GetLocationRecord,
  GetCharactersFromLocation
} from 'sr2020-mm-event-engine';

interface SoundStageUpdate {
  characterId: number;
  backgroundSound: number | undefined;
}

export type ESoundStageChanged = Typed<'soundStageChanged', {
  list: SoundStageUpdate[]
}>;

export type AudioStageEvents = ESoundStageChanged;

export interface AudioStageServiceContract extends ServiceContract {
  Request: never;
  Action: never;
  EmitEvent: AudioStageEvents;
  ListenEvent: ECharacterLocationChanged | EPutLocationRecords;
  NeedAction: never;
  NeedRequest: GetLocationRecord | GetCharactersFromLocation;
}

const metadata: ServiceContractTypes<AudioStageServiceContract> = {
  actions: [
    // 'postNotification',
  ],
  requests: [],
  emitEvents: [
    'soundStageChanged',
  ],
  listenEvents: [
    'characterLocationChanged',
    'putLocationRecords',
  ],
  needRequests: [
    'locationRecord',
    'charactersFromLocation',
  ],
  needActions: []
};
export class AudioStageService extends AbstractService<AudioStageServiceContract> {
  locationIndex: Map<number, {
    manaLevel: number | null;
  }>;

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(metadata);
    // When we get location mana update we want to update sound stage for all character at that location.
    // When character steps in new location we want to get current location mana level.
    // To meet this requirements we can use structure:
    // Map(
    //   locationId,
    //   {
    //     manaLevel: curLevel,
    //     characterSet: Set(characterId)
    //   }
    // )
    // Using this data we can generate sound rotation update list.

    this.locationIndex = new Map();
    this.onCharacterLocationChanged = this.onCharacterLocationChanged.bind(this);
    this.onPutLocationRecords = this.onPutLocationRecords.bind(this);
  }

  init() {
    super.init();
    this.on2('characterLocationChanged', this.onCharacterLocationChanged);
    this.on2('putLocationRecords', this.onPutLocationRecords);
  }

  dispose() {
    this.off2('characterLocationChanged', this.onCharacterLocationChanged);
    this.off2('putLocationRecords', this.onPutLocationRecords);
  }

  // If character exists in locationIndex - emit cur stage status as update event.
  // If character absent in locationIndex - request character location
  //  which should emit onCharacterLocationChanged.
  // updateCharacterStage() {

  // }

  onPutLocationRecords(data: EPutLocationRecords) {
  // data:  {
  //     "locationRecords": [
  //       {
  //         "id": 3047,
  //         "label": "МЧС и ГРУ",
  //         "polygon": {...},
  //         "options": {
  //           "manaLevel": 5,
  //           "effectList": []
  //         },
  //         "layer_id": 1
  //       },
  //     ]
  //   }
    const locationRecords2 = data.locationRecords.map((record) => ({
      locationId: record.id,
      manaLevel: record.options.manaLevel,
    }));

    const changedManaLevelLocs = locationRecords2.filter((el) => {
      const data2 = this.locationIndex.get(el.locationId);
      if (!data2) {
        return false;
      }
      return data2.manaLevel !== el.manaLevel;
    });
    const soundStageUpdates = R.flatten(changedManaLevelLocs.map(({ locationId, manaLevel }) => {
      const data2 = this.locationIndex.get(locationId);
      if (data2 && manaLevel !== undefined) {
        data2.manaLevel = manaLevel;
      }
      const characterSet = this.getFromModel2({
        type: 'charactersFromLocation',
        locationId,
      });
      return [...characterSet].map((characterId) => ({
        characterId,
        backgroundSound: manaLevel,
      }));
    }));
    this.emit2({
      type: 'soundStageChanged',
      list: soundStageUpdates,
    });
    // this.logger.info('onPutLocationRecords', changedManaLevelLocs);
    // this.logger.info('soundStageUpdates', soundStageUpdates);
  }

  onCharacterLocationChanged(data: ECharacterLocationChanged): void {
    // data: {
    //   "type": "putCharLocationConfirmed",
    //   "characterId": 51935,
    //   "locationId": 3062,
    //   "prevLocationId": 3080
    // }
    const { characterId, locationId, prevLocationId } = data;
    // if (this.locationIndex.has(prevLocationId)) {
    //   const { characterSet } = this.locationIndex.get(prevLocationId);
    //   characterSet.delete(characterId);
    // }

    let manaLevel: number | null = null;
    if (locationId !== null) {
      const locationRecord = this.getLocation(locationId);
      if (!locationRecord) {
        // this.logger.error('onCharacterLocationChanged, character location not found', characterId, locationId);
        // TODO - emit event that user has no background sound
        // return;
      } else {
        if(locationRecord.options.manaLevel !== undefined) {
          manaLevel = locationRecord.options.manaLevel;
        }
      }
    }

    if (locationId !== null && !this.locationIndex.has(locationId)) {
      this.locationIndex.set(locationId, {
        manaLevel,
        // characterSet: new Set(),
      });
    }
    // const { characterSet } = this.locationIndex.get(locationId);
    // characterSet.add(characterId);
    // const list: ESoundStageChanged["list"] = ;
    // this.logger.info('soundStageChanged', list);
    if (manaLevel !== null) {
      this.emit2({
        type: 'soundStageChanged',
        list: [{
          characterId,
          backgroundSound: manaLevel,
        }],
      });
    // } else {
    //   this.logger.warn(`character ${characterId} location is null so mana level is not sounded`);
    }
    // todo - emit event that user has new background sound

    // this.logger.info('onCharacterLocationChanged', data);
    // this.logger.info(this.locationIndex);
  }

  getLocation(locationId: number): LocationRecord | null {
    return this.getFromModel2({
      type: 'locationRecord',
      id: locationId,
    });
  }
}
