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
  }

  dispose() {
    this.soundHolder.dispose();
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
      const sounds = this.soundService.getSounds();
      if (manaLevel === 'low' && sounds[0]) {
        this.soundHolder.playSound(sounds[0].name);
      }
      if (manaLevel === 'normal' && sounds[1]) {
        this.soundHolder.playSound(sounds[1].name);
      }
      if (manaLevel === 'high' && sounds[2]) {
        this.soundHolder.playSound(sounds[2].name);
      }
    } else {
      this.soundHolder.playSound();
      // this.soundService.stopAllSounds();
    }
    this.location = location;
  }
}
