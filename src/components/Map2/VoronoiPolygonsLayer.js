import L from 'leaflet/dist/leaflet-src';

import { COLOR_PALETTE } from '../../utils/colorPalette';

export class VoronoiPolygonsLayer {
  polygonsGroup = L.layerGroup([]);

  massCentersGroup = L.layerGroup([]);

  polygonsKey = 'voronoiPolygonsLayer';

  massCentersGroupKey = 'massCentersLayer';

  getLayersMeta() {
    return {
      [this.polygonsKey]: this.polygonsGroup,
      [this.massCentersGroupKey]: this.massCentersGroup,
    };
  }

  updateVoronoiPolygons(gameModel, translator) {
    // const { gameModel } = this.props;
    const { boundingPolylineData, polygonData } = gameModel.get('voronoiPolygonData');
    this.massCentersGroup.clearLayers();
    this.polygonsGroup.clearLayers();

    const boundingPolyline = L.polyline(translator.moveTo(boundingPolylineData), { color: 'blue' });
    const polygons = polygonData.clippedPolygons.map((polygon, i) => L.polygon(translator.moveTo(polygon), {
      fillColor: COLOR_PALETTE[i % COLOR_PALETTE.length].color.background,
      fillOpacity: 0.5,
      pmIgnore: true,
    }));

    polygons.forEach((p) => this.polygonsGroup.addLayer(p));
    this.polygonsGroup.addLayer(boundingPolyline);

    const massCenters = polygonData.clippedCenters
      .filter((massCenter) => !Number.isNaN(massCenter.x) && !Number.isNaN(massCenter.y))
      .map((massCenter) => L.circleMarker(translator.moveTo([massCenter.x, massCenter.y]), {
        radius: 5,
        pmIgnore: true,
      }));
    massCenters.forEach((p) => this.massCentersGroup.addLayer(p));
  }
}
