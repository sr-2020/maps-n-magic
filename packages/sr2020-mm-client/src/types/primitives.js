import {
  shape, number, string, func, node, arrayOf, oneOf,
} from 'prop-types';

import { sequenceOf } from 'airbnb-prop-types';

export const promise = shape({
  then: func.isRequired,
  catch: func.isRequired,
});

export const polygonPropTypes = arrayOf(sequenceOf({
  validator: number.isRequired,
  min: 2,
  max: 2,
}));

export const beaconPropTypes = shape({
  x: number.isRequired,
  y: number.isRequired,
  id: string.isRequired,
  props: shape({
    sound: string.isRequired,
  }).isRequired,
});

export const childrenPropTypes = node;

// oneOfType([
//   shape({
//     type: node.isRequired,
//   }),
//   arrayOf(
//     shape({
//       type: node.isRequired,
//     })
//   ),
// ]);

export const beacon2PropTypes = shape({
  name: string.isRequired,
  id: number.isRequired,
  lat: number.isRequired,
  lng: number.isRequired,
});

export const latLngPropTypes = shape({
  lat: number.isRequired,
  lng: number.isRequired,
});

export const locationPropTypes = shape({
  name: string.isRequired,
  id: number.isRequired,
  markers: arrayOf(number).isRequired,
  latlngs: arrayOf(arrayOf(latLngPropTypes)).isRequired,
});

export const planePropTypes = oneOf(['real', 'astral', 'subastral']);

export const manaLevels = (['low', 'normal', 'high']);

export const spiritPropTypes = shape({
  id: number.isRequired,
  name: string.isRequired,
  aura: string.isRequired,
  fraction: string.isRequired,
  story: string.isRequired,
  abilities: arrayOf(string).isRequired,

  latLng: latLngPropTypes.isRequired,
  plane: planePropTypes.isRequired,
  hitPoints: number.isRequired,
  maxHitPoints: number.isRequired,
});

export const defaultSpirit = {
  name: '',
  aura: '',
  fraction: '',
  story: '',
  abilities: [],

  latLng: {
    lat: 0,
    lng: 0,
  },
  plane: 'subastral',
  hitPoints: 10,
  maxHitPoints: 10,
};

//   properties: {
//     name: { type: 'string', title: 'Name', default: '' },
//     story: { type: 'string', title: 'Story', default: '' },
//     fraction: { type: 'string', title: 'Story', default: '' },
//     aura: { type: 'string', title: 'Story', default: '' },
//     abilities: { type: 'string', title: 'Story', default: '' },

//     itinerary: {},
//     // latitude: { type: 'number', title: 'Latitude', default: 0 },
//     // longitude: { type: 'number', title: 'Longitude', default: 0 },
//   },
// };

// state
// latLng
// plane
// relation to ...
// hitPoints
