import L from 'leaflet/dist/leaflet-src';

export class SignalRadiusesLayer {
  group = L.layerGroup([]);

  nameKey = 'signalRadiusesLayer';

  getLayersMeta() {
    return {
      [this.nameKey]: this.group,
    };
  }

  clear() {
    this.group.clearLayers();
  }

  populate(gameModel, translator) {
    gameModel.get('beacons').map(translator.moveTo).forEach((beacon) => {
      this.group.addLayer(L.circle({
        lat: beacon.lat,
        lng: beacon.lng,
      }, {
        radius: 13,
        pmIgnore: true,
      }));
    });
  }

  updateSignalRadiuses(gameModel, translator) {
    this.clear();
    this.populate(gameModel, translator);
  }
}
