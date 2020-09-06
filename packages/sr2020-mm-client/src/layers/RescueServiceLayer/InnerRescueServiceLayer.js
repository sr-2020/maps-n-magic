import L from 'leaflet/dist/leaflet-src';
import * as R from 'ramda';

import { getIcon } from '../../utils/icons';

// based on Leaflet implementation
// https://github.com/Leaflet/Leaflet/blob/37d2fd15ad6518c254fae3e033177e96c48b5012/src/layer/vector/Polygon.js#L76
function getPolygonCentroid(polygon) {
  const pairs = R.aperture(2, [...polygon[0], polygon[0][0]]);
  const data = pairs.reduce((acc, [p1, p2]) => {
    const f = p1.lat * p2.lng - p2.lat * p1.lng;
    acc.lat += (p1.lat + p2.lat) * f;
    acc.lng += (p1.lng + p2.lng) * f;
    acc.area += f * 3;
    return acc;
  }, {
    lat: 0,
    lng: 0,
    area: 0,
  });
  if (data.area === 0) {
    // Polygon is so small that all points are on same pixel.
    return pairs[0];
  }
  return {
    lat: data.lat / data.area,
    lng: data.lng / data.area,
  };
}

const isClinicallyDead = (charState) => charState.healthState === 'clinically_dead';

// function getPolygonAvgPoint(polygon) {
//   const data = polygon[0].reduce((acc, point) => {
//     acc.lat += point.lat;
//     acc.lng += point.lng;
//     acc.count++;
//     return acc;
//   }, {
//     lat: 0,
//     lng: 0,
//     count: 0,
//   });
//   return {
//     lat: data.lat / data.count,
//     lng: data.lng / data.count,
//   };
// }

export class InnerRescueServiceLayer {
  group = L.layerGroup([]);

  nameKey = 'rescueServiceLayer';

  getLayersMeta() {
    return {
      [this.nameKey]: this.group,
    };
  }

  clear() {
    this.group.clearLayers();
  }

  populate(gameModel, translator, t) {
    const characterHealthStates = gameModel.get('characterHealthStates');
    const isClinicallyDead2 = (charId) => isClinicallyDead(characterHealthStates[charId]);
    R.keys(characterHealthStates).filter(isClinicallyDead2).forEach((characterId) => {
      this.addCharacterToMarker(characterId, characterHealthStates[characterId].locationId, gameModel);
    });
  }

  onСharacterHealthStateChanged(data, gameModel) {
    const { characterId, characterHealthState, prevCharacterHealthState } = data;
    if (prevCharacterHealthState) {
      this.removeCharacterFromMarker(characterId, prevCharacterHealthState.locationId, gameModel);
    }
    if (isClinicallyDead(characterHealthState)) {
      this.addCharacterToMarker(characterId, characterHealthState.locationId, gameModel);
    } else if (!isClinicallyDead(characterHealthState)) {
      this.removeCharacterFromMarker(characterId, characterHealthState.locationId, gameModel);
    }
  }

  addCharacterToMarker(characterId, locationId, gameModel) {
    const marker = this.getMarker(locationId, gameModel, true);
    if (R.isNil(marker)) {
      return;
    }
    marker.options.clinicalDeathIds = R.uniq([...marker.options.clinicalDeathIds, characterId]);
    this.updateMarkerTooltip(marker, gameModel);
  }

  removeCharacterFromMarker(characterId, locationId, gameModel) {
    const marker = this.getMarker(locationId, null, false);
    if (R.isNil(marker)) {
      return;
    }
    marker.options.clinicalDeathIds = R.without([characterId], marker.options.clinicalDeathIds);
    this.updateMarkerTooltip(marker, gameModel);
    if (R.isEmpty(marker.options.clinicalDeathIds)) {
      marker.unbindTooltip();
      this.group.removeLayer(marker);
    }
  }

  getMarker(locationId, gameModel, createIfAbsent) {
    const marker = this.group.getLayers().find((marker2) => marker2.options.locationId === locationId);
    if (marker) {
      return marker;
    }
    if (createIfAbsent) {
      const location = gameModel.get({
        type: 'locationRecord',
        id: locationId,
      });
      if (!location || R.isEmpty(location.polygon)) return null;
      const marker2 = L.marker(getPolygonCentroid(location.polygon), {
        locationId,
        clinicalDeathIds: [],
      });
      marker2.setIcon(getIcon('red'));
      this.group.addLayer(marker2);
      return marker2;
    }
    return null;
  }

  // eslint-disable-next-line class-methods-use-this
  getUserNameStr(user) {
    return user && user.name !== '' ? ` (${user.name})` : '';
  }

  // eslint-disable-next-line class-methods-use-this
  updateMarkerTooltip(marker, gameModel) {
    // marker.bindPopup(`id персонажей: ${marker.options.clinicalDeathIds.join(', ')}`).openPopup();
    marker.unbindTooltip();
    const labels = marker.options.clinicalDeathIds.map((id) => id + this.getUserNameStr(gameModel.get({
      type: 'userRecord',
      id: Number(id),
    })));
    marker.bindTooltip(`id персонажей: ${labels.join(', ')}`, {
      permanent: true,
    });
    // marker.openTooltip();
    // marker.on('mouseover', function (e) {
    //   // beacon.bindTooltip(t('markerTooltip', { name: this.options.label }));
    //   marker.bindTooltip(`id персонажей: ${marker.options.clinicalDeathIds.join(', ')}`);
    //   this.openTooltip();
    // });
    // marker.on('mouseout', function (e) {
    //   this.closeTooltip();
    // });
  }
}
