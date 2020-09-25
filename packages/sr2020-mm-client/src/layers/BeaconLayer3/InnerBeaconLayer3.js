import L from 'leaflet/dist/leaflet-src';
import * as R from 'ramda';

import { hasLatLng } from '../BeaconLayer4/beaconUtils';

export class InnerBeaconLayer3 {
  group = L.layerGroup([]);

  nameKey = 'beaconsLayer';

  getLayersMeta() {
    return {
      [this.nameKey]: this.group,
    };
  }

  clear() {
    this.group.clearLayers();
  }

  populate(gameModel, translator, setBeaconEventHandlers, t) {
    const prepareArray = R.pipe(
      R.filter(hasLatLng),
      R.map(translator.moveTo),
    );
    const beacons = prepareArray(gameModel.get('beaconRecords'));
    R.map(this.createAndAddBeacon(setBeaconEventHandlers, t), beacons);
  }

  createAndAddBeacon = (setBeaconEventHandlers, t) => R.pipe(
    this.createBeacon(t),
    setBeaconEventHandlers,
    this.group.addLayer.bind(this.group),
  );

  // eslint-disable-next-line class-methods-use-this
  createBeacon = R.curry((t, {
    lat, lng, label, id,
  }) => {
    const beacon = L.marker({ lat, lng }, {
      id, label,
    });
    beacon.on('mouseover', function (e) {
      beacon.bindTooltip(t('markerTooltip', { name: this.options.label }));
      this.openTooltip();
    });
    beacon.on('mouseout', function (e) {
      this.closeTooltip();
    });
    return beacon;
  })

  onPutBeaconRecord(beaconRecord, setBeaconEventHandlers, t) {
    const beacon = this.group.getLayers().find((loc2) => loc2.options.id === beaconRecord.id);
    if (!beacon) { // put beacon
      this.createAndAddBeacon(setBeaconEventHandlers, t)(beaconRecord);
    } else if (hasLatLng(beaconRecord)) { // post beacon
      beacon.setLatLng({
        lat: beaconRecord.lat,
        lng: beaconRecord.lng,
      });
    } else { // remove beacon
      this.group.removeLayer(beacon);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  onRemoveBeacon(beacon, gameModel) {
    gameModel.execute({
      type: 'putBeaconRecord',
      id: beacon.options.id,
      props: {
        lat: null,
        lng: null,
      },
    });
  }
}
