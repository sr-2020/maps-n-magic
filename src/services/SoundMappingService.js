import * as R from 'ramda';
import { AbstractService } from './AbstractService';

export class SoundMappingService extends AbstractService {
  metadata = {
    actions: ['mapSoundToKey'],
    requests: ['soundMapping', 'soundForKey'],
    emitEvents: ['soundToKeySet'],
    listenEvents: [],
  };

  constructor() {
    super();
    this.soundMapping = {
      manaLevels: {},
      spiritFractions: {},
    };
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

  // isEmpty() {
  //   return R.isEmpty(this.soundMapping);
  // }
}
