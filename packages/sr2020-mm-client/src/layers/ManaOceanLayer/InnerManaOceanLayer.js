import L from 'leaflet/dist/leaflet-src';
import * as R from 'ramda';

import { isGeoLocation } from 'sr2020-mm-event-engine/utils';

// .bg-blue-100	background-color: #ebf8ff;
// .bg-blue-300	background-color: #90cdf4;
// .bg-blue-500	background-color: #4299e1;
// .bg-blue-700	background-color: #2b6cb0;
// .bg-blue-900	background-color: #2a4365;

const manaFillColors = {
  1: '#f7fafc', // 100 from gray palette
  2: '#90cdf4',
  3: '#4299e1',
  4: '#2b6cb0',
  5: '#2a4365',
};

export class InnerManaOceanLayer {
  group = L.layerGroup([]);

  nameKey = 'manaOceanLayer';

  getLayersMeta() {
    return {
      [this.nameKey]: this.group,
    };
  }

  clear() {
    this.group.clearLayers();
  }

  populate(gameModel, translator, t) {
    const isNotEmptyPolygon = R.pipe(
      R.prop('polygon'),
      R.equals({}),
      R.not,
    );
    const prepareArray = R.pipe(
      R.filter(isGeoLocation),
      R.filter(isNotEmptyPolygon),
      R.map((location) => {
        const copy = { ...location };
        copy.polygon[0] = translator.moveTo(location.polygon[0]);
        return copy;
      }),
    );
    const locationsData = prepareArray(gameModel.get('locationRecords'));
    R.map(this.createAndAddLocation(t), locationsData);

    // const characterHealthStates = gameModel.get('characterHealthStates');
    // const isClinicallyDead2 = (charId) => isClinicallyDead(characterHealthStates[charId]);
    // R.keys(characterHealthStates).filter(isClinicallyDead2).forEach((characterId) => {
    //   this.addCharacterToMarker(characterId, characterHealthStates[characterId].locationId, gameModel);
    // });
  }

  createAndAddLocation = (t) => R.pipe(
    this.createLocation(t),
    // setLocationEventHandlers,
    (location) => {
      this.group.addLayer(location);
      // this.getGroupByLayerId(location.options.layer_id).addLayer(location);
    },
  );

  createLocation = R.curry((t, {
    polygon, label, id, layer_id, options,
  }) => {
    const manaLevel = (id % 5) + 1;
    const loc = L.polygon([polygon[0]], {
      // id, label, layer_id, color: options.color, weight: options.weight, fillOpacity: options.fillOpacity,
      id, label, layer_id, color: manaFillColors[manaLevel], weight: options.weight, fillOpacity: 1,
    });
    loc.on('mouseover', function (e) {
      loc.bindTooltip(t('manaGeoLocationTooltip', { name: this.options.label, manaLevel }));
      this.openTooltip();
    });
    loc.on('mouseout', function (e) {
      this.closeTooltip();
    });
    return loc;
  })

  onPostLocationRecord(locationRecord, setLocationEventHandlers, t) {
    this.createAndAddLocation(setLocationEventHandlers, t)(locationRecord);
  }

  onPutLocationRecord(locationRecord) {
    const loc = this.group.getLayers().find((loc2) => loc2.options.id === locationRecord.id);
    loc.setLatLngs([locationRecord.polygon[0]]);
  }

  onRemoveLocation(location, gameModel) {
    this.group.removeLayer(location);
    R.values(this.groups).forEach((group) => group.removeLayer(location));
    gameModel.execute({
      type: 'deleteLocationRecord',
      id: location.options.id,
    });
    // this.updateLocationsView();
  }
}
