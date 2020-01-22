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
    needRequests: ['soundForKey'],
    listenEvents: ['soundToKeySet', 'userPositionUpdate'],
  };

  constructor() {
    super();
    // this.gameModel = null;
    this.location = null;
    this.onSoundToKeySet = this.onSoundToKeySet.bind(this);
    this.onUserPositionUpdate = this.onUserPositionUpdate.bind(this);
  }

  init(...args) {
    super.init(...args);
    // this.gameModel = gameModel;
    this.on('soundToKeySet', this.onSoundToKeySet);
    this.on('userPositionUpdate', this.onUserPositionUpdate);
  }

  dispose() {
    this.off('soundToKeySet', this.onSoundToKeySet);
    this.off('userPositionUpdate', this.onUserPositionUpdate);
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
        key: manaLevel,
      });
      this.executeOnModel({
        type: 'setBackgroundSound',
        name: soundName,
      });
    } else {
      this.executeOnModel({
        type: 'setBackgroundSound',
        name: null,
      });
    }
    this.location = R.clone(location);
  }
}
