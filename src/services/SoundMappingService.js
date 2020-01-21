import * as R from 'ramda';
import { AbstractService } from './AbstractService';

function stringToType(entity) {
  return R.is(String, entity) ? {
    type: entity,
  } : entity;
}

export class SoundMappingService extends AbstractService {
  metadata = {
    actions: ['mapSoundToKey'],
    requests: ['soundMapping', 'soundForKey'],
    emitEvents: ['soundToKeySet'],
    listenEvents: [],
  };

  constructor() {
    super();
    this.soundMapping = {};
  }

  setData({ soundMapping } = {}) {
    this.soundMapping = soundMapping || {};
  }

  getData() {
    return {
      soundMapping: this._getSoundMapping(),
    };
  }

  execute(action, onDefaultAction) {
    action = stringToType(action);
    if (action.type === 'mapSoundToKey') {
      return this._mapSoundToKey(action);
    }
    return onDefaultAction(action);
  }

  get(request, onDefaultRequest) {
    request = stringToType(request);
    if (request.type === 'soundMapping') {
      return this._getSoundMapping(request);
    }
    if (request.type === 'soundForKey') {
      return this._getSoundForKey(request);
    }
    return onDefaultRequest(request);
  }

  _getSoundMapping() {
    return this.soundMapping;
  }

  getSoundMapping() {
    return this._getSoundMapping();
  }

  _mapSoundToKey({ key, soundName }) {
    if (this.getFromModel({
      type: 'sound',
      name: soundName,
    })) {
      this.soundMapping[key] = soundName;
      this.emit('soundToKeySet', {
        key,
        soundName,
      });
    } else {
      console.error('Trying to map to absent sound key', key, 'sound', soundName);
    }
  }

  mapSoundToKey(key, soundName) {
    return this._mapSoundToKey({ key, soundName });
  }

  _getSoundForKey({ key }) {
    return this.soundMapping[key];
  }

  getSoundForKey(key) {
    return this.getSoundForKey({ key });
  }

  // isEmpty() {
  //   return R.isEmpty(this.soundMapping);
  // }
}
