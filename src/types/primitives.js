import {
  shape, number, string, func, node, arrayOf,
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
