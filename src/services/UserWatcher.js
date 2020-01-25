import * as R from 'ramda';
import * as gi from '@thi.ng/geom-isec';

import L from 'leaflet/dist/leaflet-src';
import { AbstractService } from './AbstractService';


const latlngs2arr = R.map((el) => [el.lat, el.lng]);

function latLngsToBounds(latLngs) {
  const bounds = new L.LatLngBounds();
  latLngs.forEach(bounds.extend.bind(bounds));
  return bounds;
}

function isPointInLocation(latlng, latlngPolygon) {
  // const latlngPolygon = loc.getLatLngs();
  // const bounds = loc.getBounds();
  const bounds = latLngsToBounds(latlngPolygon);

  const simpleTest = bounds.contains(latlng);
  if (simpleTest) {
    const coords = [latlng.lat, latlng.lng];
    const polygon = latlngs2arr(latlngPolygon);
    return gi.pointInPolygon2(coords, polygon);
  }
  return false;
}

export class UserWatcher extends AbstractService {
  metadata = {
    actions: [],
    requests: [],
    emitEvents: [],
    needActions: ['setBackgroundSound'],
    needRequests: ['soundForKey', 'activeBots', 'locations', 'sounds', 'soundStage'],
    listenEvents: ['soundToKeySet', 'userPositionUpdate', 'botUpdate'],
  };

  constructor() {
    super();
    this.location = null;
    this.onSoundToKeySet = this.onSoundToKeySet.bind(this);
    this.onUserPositionUpdate = this.onUserPositionUpdate.bind(this);
    this.onBotUpdate = this.onBotUpdate.bind(this);
  }

  init(...args) {
    super.init(...args);
    this.on('soundToKeySet', this.onSoundToKeySet);
    this.on('userPositionUpdate', this.onUserPositionUpdate);
    this.on('botUpdate', this.onBotUpdate);
  }

  dispose() {
    this.off('soundToKeySet', this.onSoundToKeySet);
    this.off('userPositionUpdate', this.onUserPositionUpdate);
    this.off('botUpdate', this.onBotUpdate);
  }

  onSoundToKeySet({ key, soundName }) {
    if (!this.location) {
      return;
    }
    const { manaLevel } = this.location;
    if (manaLevel === key) {
      this.executeOnModel({
        type: 'setBackgroundSound',
        name: soundName,
      });
    }
  }

  onBotUpdate({ bots }) {
    this.updateBotSounds({ bots });
  }

  updateBotSounds({ bots }) {
    if (!this.location) {
      return;
    }
    const sounds = this.getFromModel('sounds').filter((sound) => sound.name.includes('spirit')).map(R.prop('name'));
    if (sounds.length === 0) {
      return;
    }
    const closeBots = bots.filter((bot) => {
      const latlng = bot.getCurPosition();
      return isPointInLocation(latlng, this.location.latlngs[0]);
    });

    const curSoundStage = this.getFromModel('soundStage');

    const newRotation = R.uniq(closeBots.map((bot) => sounds[bot.getIndex() % sounds.length]));
    // console.log('closeBots.length', closeBots.length);

    if (R.symmetricDifference(curSoundStage.rotationSounds, newRotation).length === 0) {
      return;
    }
    this.executeOnModel({
      type: 'rotationSoundsChange',
      added: R.difference(newRotation, curSoundStage.rotationSounds),
      remove: R.difference(curSoundStage.rotationSounds, newRotation),
    });
    // console.log('newRotation', newRotation);
  }

  onUserPositionUpdate(user) {
    const coords = user.pos && user.pos.coords;
    const latlng = coords ? {
      lat: coords.latitude,
      lng: coords.longitude,
    } : null;
    const locations = this.getFromModel('locations');
    // if (this.location && isPointInLocation(latlng, this.location.getLatLngs()[0])) {
    if (this.location && isPointInLocation(latlng, this.location.latlngs[0])) {
      return;
    }
    // gi
    const location = locations.find((loc) => isPointInLocation(latlng, loc.latlngs[0]));
    // console.log('location', location && location.options.name);
    if (this.location === location) {
      return;
    }
    if (location) {
      const { manaLevel } = location;

      const soundName = this.getFromModel({
        type: 'soundForKey',
        keyType: 'manaLevels',
        key: manaLevel,
      });
      this.executeOnModel({
        type: 'setBackgroundSound',
        name: soundName,
        // name: null,
      });
    } else {
      this.executeOnModel({
        type: 'setBackgroundSound',
        name: null,
      });
    }
    this.location = R.clone(location);

    this.updateBotSounds({
      bots: this.getFromModel('activeBots'),
    });
  }
}
