import * as R from 'ramda';
import { AbstractService } from './AbstractService';

const defaultSoundMapping = {
  manaLevels: {
    high: 'mana_strong_07064025.mp3',
    normal: 'mana_normal_07059107.mp3',
    low: 'mana_weak_07072013.mp3',
  },
  spiritFractions: {
    Дрозд: 'spirit2_drozd.mp3',
    Медведь: 'spirit3_medved.mp3',
    Неясыть: 'spirit1_neiasit.mp3',
  },
};

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
    this.soundMapping = R.clone(defaultSoundMapping);
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
    this.soundMapping = soundMapping || R.clone(defaultSoundMapping);
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
