import L from 'leaflet/dist/leaflet-src';
import * as R from 'ramda';

import { isGeoLocation } from 'sr2020-mm-event-engine/utils';

// .bg-blue-100	background-color: #ebf8ff;
// .bg-blue-300	background-color: #90cdf4;
// .bg-blue-500	background-color: #4299e1;
// .bg-blue-700	background-color: #2b6cb0;
// .bg-blue-900	background-color: #2a4365;

// const manaFillColors = { // based on tailwind blue
//   1: '#f7fafc', // 100 from gray palette
//   2: '#90cdf4',
//   3: '#4299e1',
//   4: '#2b6cb0',
//   5: '#2a4365',
// };
// const manaFillColors = { // based on h240
//   1: '#fff', // white
//   2: '#d6d6f5',
//   3: '#a8a8f0',
//   4: '#7676ef',
//   5: '#3d3df5',
// };

const manaFillColors = { // based on h202
  1: 'white', // hsla(202, 60%, 90%, 1)
  2: '#c4deee', // hsla(202, 55%, 85%, 1)
  3: '#7dc1e8', // hsla(202, 70%, 70%, 1)
  4: '#2ba6ee', // hsla(202, 85%, 55%, 1)
  5: '#0081cc', // hsla(202, 100%, 40%, 1)
};
// .bg-gray-100	background-color: #f7fafc;
// .bg-gray-200	background-color: #edf2f7;
// .bg-gray-300	background-color: #e2e8f0;
// .bg-gray-400	background-color: #cbd5e0;
// .bg-gray-500	background-color: #a0aec0;
// .bg-gray-600	background-color: #718096;
// .bg-gray-700	background-color: #4a5568;
// .bg-gray-800	background-color: #2d3748;
// .bg-gray-900	background-color: #1a202c;

// #ccf
// #99f
// #66f
// #33f
// #0000fa

// const strokeColors = {
//   1: '#ccf', // 100 from gray palette
//   2: '#99f',
//   3: '#66f',
//   4: '#33f',
//   5: '#0000fa',
// };
// const strokeColors = {
//   1: '#4a5568', // 100 from gray palette
//   2: '#4a5568',
//   3: '#4a5568',
//   4: '#e2e8f0',
//   5: '#e2e8f0',
// };

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
    // const manaLevel = (id % 5) + 1;
    // const manaLevel = 5;
    // const manaLevel = 1;
    const loc = L.polygon([polygon[0]], {
      // id, label, layer_id, color: options.color, weight: options.weight, fillOpacity: options.fillOpacity,
      // id, label, layer_id, color: '#2d3748', weight: 2, dashArray: [10], fillColor: manaFillColors[manaLevel], fillOpacity: 1,
      id, label, layer_id, color: '#1a202c', weight: 2, dashArray: [7], fillColor: manaFillColors[options.manaLevel], fillOpacity: 1,
    });
    loc.on('mouseover', function (e) {
      loc.bindTooltip(t('manaGeoLocationTooltip', { name: this.options.label, manaLevel: options.manaLevel }));
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

  onPutLocationRecord(locationRecord, t) {
    const { manaLevel } = locationRecord.options;
    const loc = this.group.getLayers().find((loc2) => loc2.options.id === locationRecord.id);
    loc.setLatLngs([locationRecord.polygon[0]]);
    loc.setStyle({ fillColor: manaFillColors[manaLevel] });
    loc.on('mouseover', function (e) {
      loc.bindTooltip(t('manaGeoLocationTooltip', { name: this.options.label, manaLevel }));
      this.openTooltip();
    });
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
