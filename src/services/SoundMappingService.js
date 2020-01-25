import * as R from 'ramda';
import { AbstractService } from './AbstractService';

export class SoundMappingService extends AbstractService {
  metadata = {
    ...this.metadata,
    actions: ['mapSoundToKey'],
    requests: ['soundMapping', 'soundForKey'],
    emitEvents: ['soundToKeySet', 'soundMappingChange'],
    listenEvents: ['fractionChange'],
    needRequests: ['sound'],
  };

  constructor() {
    super();
    this.soundMapping = {
      manaLevels: {},
      spiritFractions: {},
    };
    this.onFractionChange = this.onFractionChange.bind(this);
  }

  init(...args) {
    super.init(...args);
    this.on('fractionChange', this.onFractionChange);
  }

  dispose() {
    this.off('fractionChange', this.onFractionChange);
  }

  setData({ soundMapping } = {}) {
    this.soundMapping = soundMapping || {
      manaLevels: {},
      spiritFractions: {},
    };
  }

  getData() {
    return {
      soundMapping: this.getSoundMapping(),
    };
  }

  getSoundMapping() {
    return this.soundMapping;
  }

  mapSoundToKey({ key, keyType, soundName }) {
    if (this.getFromModel({
      type: 'sound',
      name: soundName,
    })) {
      this.soundMapping[keyType][key] = soundName;
      this.emit('soundToKeySet', {
        key,
        soundName,
        keyType,
      });
    } else {
      console.error('Trying to map to absent sound key', key, 'sound', soundName);
    }
  }

  getSoundForKey({ key, keyType }) {
    return this.soundMapping[keyType][key];
  }

  onFractionChange({ removed }) {
    const usedFractions = R.keys(this.soundMapping.spiritFractions);
    if (removed.length > 0 && R.intersection(usedFractions, removed).length > 0) {
      const existingFractions = R.difference(usedFractions, removed);
      this.soundMapping = {
        ...this.soundMapping,
        spiritFractions: R.pick(existingFractions, this.soundMapping.spiritFractions),
      };
      this.emit('soundMappingChange', {
        ...this.soundMapping,
      });
    }
  }

  // isEmpty() {
  //   return R.isEmpty(this.soundMapping);
  // }
}
