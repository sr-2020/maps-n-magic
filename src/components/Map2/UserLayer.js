import L from 'leaflet/dist/leaflet-src';

export class UserLayer {
  group = L.layerGroup([]);

  nameKey = 'userLayer';

  getLayersMeta() {
    return {
      [this.nameKey]: this.group,
    };
  }

  onUserPositionUpdate(user, translator) {
    const layers = this.group.getLayers();
    const hasUser = layers.length > 0;
    const coords = user.pos && user.pos.coords;
    const latlng = coords ? {
      lat: coords.latitude,
      lng: coords.longitude,
    } : null;
    if (!coords && !hasUser) {
      return;
    }
    if (!coords && hasUser) {
      this.group.removeLayer(layers[0]);
    }
    if (coords && !hasUser) {
      const { markerClass: MarkerClass, markerStyle } = L.Control.Locate.prototype.options;
      const userMarker = new MarkerClass(translator.moveTo(latlng), markerStyle);
      this.group.addLayer(userMarker);
    }
    if (coords && hasUser) {
      layers[0].setLatLng(translator.moveTo(latlng));
    }
  }
}
