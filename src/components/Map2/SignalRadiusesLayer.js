import L from 'leaflet/dist/leaflet-src';

export class SignalRadiusesLayer {
  group = L.layerGroup([]);

  nameKey = 'signalRadiusesLayer';

  getLayersMeta() {
    return {
      [this.nameKey]: this.group,
    };
  }

  getGroup() {
    return this.group;
  }

  getNameKey() {
    return this.nameKey;
  }

  updateSignalRadiuses = (gameModel, translator) => {
    // const { gameModel } = this.props;
    this.group.clearLayers();
    // gameModel.getBeacons().map(this.translator.moveTo).forEach((beacon) => {
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
}
