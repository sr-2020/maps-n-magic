import L from 'leaflet/dist/leaflet-src';
import * as R from 'ramda';

import { getIcon } from 'sr2020-mm-client-core/utils/icons';

export class MarkerLayer {
  group = L.layerGroup([]);

  nameKey = 'beaconsLayer';

  getLayersMeta() {
    return {
      [this.nameKey]: this.group,
    };
  }

  onCreateMarker(marker, gameModel, translator, setMarkerEventHandlers) {
    // const { gameModel } = this.props;
    const latlng = translator.moveFrom(marker.getLatLng());
    const { id, name } = gameModel.execute({
      type: 'postBeacon',
      props: { ...latlng },
    });
    L.setOptions(marker, { id, name });
    this.group.addLayer(marker);

    setMarkerEventHandlers(marker);
    // this.onMarkersChange();
    this.updateMarkersView(gameModel);
  }

  updateMarkersView(gameModel) {
    // const { gameModel } = this.props;
    const attachedMarkers = gameModel.get('attachedBeaconIds');
    this.group.eachLayer((marker) => {
      const { id } = marker.options;
      marker.setIcon(getIcon(R.contains(id, attachedMarkers) ? 'blue' : 'red'));
    });
  }

  highlightMarkers(markers) {
    this.group.eachLayer((marker) => {
      const { id } = marker.options;
      if (R.contains(id, markers)) {
        marker.setIcon(getIcon('green'));
      }
    });
  }

  populate(gameModel, translator, t, setMarkerEventHandlers) {
    const beacons2 = gameModel.get('beacons').map(translator.moveTo);

    const markers = beacons2.map(({
      lat, lng, name, id,
    }) => L.marker({ lat, lng }, { id, name }));
    markers.forEach((marker) => {
      setMarkerEventHandlers(marker);
      marker.on('mouseover', function (e) {
        marker.bindTooltip(t('markerTooltip', { name: this.options.name }));
        this.openTooltip();
      });
      marker.on('mouseout', function (e) {
        this.closeTooltip();
      });
      this.group.addLayer(marker);
    });
    this.updateMarkersView(gameModel);
  }

  onRemoveMarker(marker, gameModel) {
    this.group.removeLayer(marker);
    gameModel.execute({
      type: 'deleteBeacon',
      id: marker.options.id,
    });
  }

  onMarkerChange(prop, value, gameModel, id, translator) {
    const marker = this.group.getLayers().find((marker2) => marker2.options.id === id);
    let resValue = value;
    if (prop === 'name') {
      marker.options.name = value;
      gameModel.execute({
        type: 'putBeacon',
        id,
        props: {
          [prop]: value,
        },
      });
    }
    if (prop === 'lat' || prop === 'lng') {
      const latLng = marker.getLatLng();
      const num = Number(value);
      if (!Number.isNaN(num)) {
        const newLatLng = { ...latLng, [prop]: num };
        marker.setLatLng(newLatLng);
        gameModel.execute({
          type: 'putBeacon',
          id,
          props: {
            ...translator.moveFrom({
              ...latLng,
              [prop]: num,
            }),
          },
        });
        resValue = num;
      }
    }
    return resValue;
  }

  clear() {
    this.group.clearLayers();
  }
}
