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
}
