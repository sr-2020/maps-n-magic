import * as R from 'ramda';

export class SoundMappingService {
  constructor() {
    this.soundMapping = {};
  }

  getSoundMapping() {
    return this.soundMapping;
  }

  mapSoundToKey(key, soundName) {
    this.soundMapping[key] = soundName;
  }

  getSoundForKey(key) {
    return this.soundMapping[key];
  }

  isEmpty() {
    return R.isEmpty(this.soundMapping);
  }
}
