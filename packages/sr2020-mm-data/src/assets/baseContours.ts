import * as R from 'ramda';
import { GeoJSON, Feature, LineString, FeatureCollection } from "geojson";

const baseClosedLLs = [
  [36.8720195, 54.9296674],
  [36.8720624, 54.9285209],
  [36.873028, 54.9285393],
  [36.8730924, 54.9282496],
  [36.8742725, 54.9282064],
  [36.874294, 54.9293469],
  [36.8741223, 54.9300065],
  [36.8727598, 54.9304504],
  [36.8723843, 54.9296675],
  [36.8720195, 54.9296674],
].map(el => R.reverse(el));

const baseLLs = [
  [36.8706891, 54.9300497],
  [36.8683717, 54.9279968],
  [36.873382, 54.9265912],
  [36.8744442, 54.9274728],
  [36.8724486, 54.9278242],
  [36.8724593, 54.9284284],
  [36.8720946, 54.9284284],
  [36.8720195, 54.9296674],
  [36.8710324, 54.9300682],
  [36.8706891, 54.9300497],
].map(el => R.reverse(el));

const baseCommonLLs = [
  [36.8706891, 54.9300497],
  [36.8683717, 54.9279968],
  [36.873382, 54.9265912],
  [36.8744442, 54.9274728],
  [36.8724486, 54.9278242],
  [36.8724593, 54.9284284],
  [36.8720946, 54.9284284],
  // [36.8720195,54.9296674],

  // [36.8720195,54.9296674],
  [36.8720624, 54.9285209],
  [36.873028, 54.9285393],
  [36.8730924, 54.9282496],
  [36.8742725, 54.9282064],
  [36.874294, 54.9293469],
  [36.8741223, 54.9300065],
  [36.8727598, 54.9304504],
  [36.8723843, 54.9296675],
  [36.8720195, 54.9296674],

  [36.8710324, 54.9300682],
  [36.8706891, 54.9300497],
].map(el => R.reverse(el));

const initialLineString: Feature<LineString> = {
  type: 'Feature',
  geometry: {
    type: 'LineString',
    coordinates: [],
  },
  properties: {
    name: '',
    stroke: '#ffd600',
    'stroke-opacity': 1,
    'stroke-width': 3.001,
    // fill: '#ffd600',
    // 'fill-opacity': 0.16862745098039217,
  },
};

function contourToFeature(contour, props): Feature<LineString> {
  const lineString: Feature<LineString> = R.clone(initialLineString);
  lineString.geometry.coordinates = contour.map(([t1, t2]) => [t2, t1, 0]);
  lineString.properties = {
    ...lineString.properties,
    ...props,
  };
  return lineString;
}

const contourGeoJson: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    contourToFeature(baseClosedLLs, {
      name: 'Закрытая территория',
      stroke: 'darkviolet',
    }),
    contourToFeature(baseLLs, {
      name: 'Территория игры',
      stroke: 'green',
    }),
  ],
};

export {
  baseClosedLLs, baseCommonLLs, baseLLs, contourGeoJson,
};
