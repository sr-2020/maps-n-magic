import L from 'leaflet/dist/leaflet-src';

import { baseClosedLLs, baseLLs } from '../../data/baseContours';

export class BaseContourLayer {
  group = L.layerGroup([]);

  nameKey = 'baseContourLayer';

  getLayersMeta() {
    return {
      [this.nameKey]: this.group,
    };
  }

  populate(translator) {
    const baseLine = L.polyline(translator.moveTo(baseLLs), {
      color: 'green',
      pmIgnore: true,
    });
    const baseClosedLine = L.polyline(translator.moveTo(baseClosedLLs), {
      color: 'darkviolet',
      pmIgnore: true,
    });
    this.group.addLayer(baseLine);
    this.group.addLayer(baseClosedLine);
  }

  clear() {
    this.group.clearLayers();
  }

  // getGroup() {
  //   return this.group;
  // }

  // getNameKey() {
  //   return this.nameKey;
  // }

  // onUserPositionUpdate(user, translator) {
  //   const layers = this.group.getLayers();
  //   const hasUser = layers.length > 0;
  //   const coords = user.pos && user.pos.coords;
  //   const latlng = coords ? {
  //     lat: coords.latitude,
  //     lng: coords.longitude,
  //   } : null;
  //   if (!coords && !hasUser) {
  //     return;
  //   }
  //   if (!coords && hasUser) {
  //     this.group.removeLayer(layers[0]);
  //   }
  //   if (coords && !hasUser) {
  //     const { markerClass: MarkerClass, markerStyle } = L.Control.Locate.prototype.options;
  //     const userMarker = new MarkerClass(translator.moveTo(latlng), markerStyle);
  //     this.group.addLayer(userMarker);
  //   }
  //   if (coords && hasUser) {
  //     layers[0].setLatLng(translator.moveTo(latlng));
  //   }
  // }
}
