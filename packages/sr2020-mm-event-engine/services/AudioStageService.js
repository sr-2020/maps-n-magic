import * as R from 'ramda';

import { AbstractService } from '../core/AbstractService';

export class AudioStageService extends AbstractService {
  metadata = {
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
  };

  constructor(...args) {
    super(...args);
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

  init(gameModel) {
    super.init(gameModel);
    this.on('characterLocationChanged', this.onCharacterLocationChanged);
    this.on('putLocationRecords', this.onPutLocationRecords);
  }

  dispose() {
    this.off('characterLocationChanged', this.onCharacterLocationChanged);
    this.off('putLocationRecords', this.onPutLocationRecords);
  }

  // If character exists in locationIndex - emit cur stage status as update event.
  // If character absent in locationIndex - request character location
  //  which should emit onCharacterLocationChanged.
  // updateCharacterStage() {

  // }

  onPutLocationRecords(data) {
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
      data2.manaLevel = manaLevel;
      const characterSet = this.getFromModel({
        type: 'charactersFromLocation',
        locationId,
      });
      return [...characterSet].map((characterId) => ({
        characterId,
        backgroundSound: manaLevel,
      }));
    }));
    this.emit('soundStageChanged', {
      type: 'soundStageChanged',
      list: soundStageUpdates,
    });
    // this.logger.info('onPutLocationRecords', changedManaLevelLocs);
    // this.logger.info('soundStageUpdates', soundStageUpdates);
  }

  onCharacterLocationChanged(data) {
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

    let manaLevel = null;
    if (locationId !== null) {
      const locationRecord = this.getLocation(locationId);
      if (!locationRecord) {
        this.logger.error('onCharacterLocationChanged, character location not found', characterId, locationId);
        // TODO - emit event that user has no background sound
        // return;
      } else {
        manaLevel = locationRecord.options.manaLevel;
      }
    }

    if (!this.locationIndex.has(locationId)) {
      this.locationIndex.set(locationId, {
        manaLevel,
        // characterSet: new Set(),
      });
    }
    // const { characterSet } = this.locationIndex.get(locationId);
    // characterSet.add(characterId);
    const list = [{
      characterId,
      backgroundSound: manaLevel,
    }];
    // this.logger.info('soundStageChanged', list);
    this.emit('soundStageChanged', {
      type: 'soundStageChanged',
      list,
    });
    // todo - emit event that user has new background sound

    // this.logger.info('onCharacterLocationChanged', data);
    // this.logger.info(this.locationIndex);
  }

  getLocation(locationId) {
    return this.getFromModel({
      type: 'locationRecord',
      id: locationId,
    });
  }
}
