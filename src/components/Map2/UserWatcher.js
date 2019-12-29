import * as R from 'ramda';
import * as gi from '@thi.ng/geom-isec';

import { SoundHolder } from '../../utils/SoundHolder';

const latlngs2arr = R.map((el) => [el.lat, el.lng]);

function isPointInLocation(latlng, loc) {
  const simpleTest = loc.getBounds().contains(latlng);
  if (simpleTest) {
    const coords = [latlng.lat, latlng.lng];
    const latlngPolygon = loc.getLatLngs();
    const polygon = latlngs2arr(latlngPolygon[0]);
    return gi.pointInPolygon2(coords, polygon);
  }
  return false;
}

export class UserWatcher {
  constructor(soundService) {
    this.soundService = soundService;
    this.soundHolder = new SoundHolder(soundService);
    this.location = null;
    this.onSoundToKeySet = this.onSoundToKeySet.bind(this);
    this.soundService.on('soundToKeySet', this.onSoundToKeySet);
  }

  dispose() {
    this.soundService.off('soundToKeySet', this.onSoundToKeySet);
    this.soundHolder.dispose();
  }

  onSoundToKeySet({ key, soundName }) {
    if (!this.location) {
      return;
    }
    const { manaLevel } = this.location.options;
    if (manaLevel === key) {
      this.soundHolder.playSound(soundName);
    }
  }

  updateUserLocation(e, locations) {
    const { latlng } = e;
    if (this.location && isPointInLocation(latlng, this.location)) {
      return;
    }
    // gi
    const location = locations.find((loc) => isPointInLocation(latlng, loc));
    // console.log('location', location && location.options.name);
    if (this.location === location) {
      return;
    }
    if (location) {
      const { manaLevel } = location.options;
      const soundName = this.soundService.getSoundForKey(manaLevel);
      this.soundHolder.playSound(soundName);
    } else {
      this.soundHolder.playSound();
      // this.soundService.stopAllSounds();
    }
    this.location = location;
  }
}
