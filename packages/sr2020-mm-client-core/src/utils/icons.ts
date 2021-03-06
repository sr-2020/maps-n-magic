import L, { IconOptions, Icon } from 'leaflet';
import * as R from 'ramda';

const defaults: IconOptions = {
  shadowUrl: './images/leafletImages/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  iconUrl: null
};

export enum iconColors {
  black,
  blue,
  green,
  grey,
  orange,
  red,
  violet,
  yellow,
};

const usedIcons: {
  [color in iconColors]?: Icon
} = {};

export const getIcon = (color: iconColors) => {
  if (iconColors[color] !== undefined) {
    throw new Error(`Unexpected color ${color}`);
  }
  if (!usedIcons[color]) {
    const opts = R.clone(defaults);
    opts.iconUrl = `./images/leafletImages/marker-icon-2x-${color}.png`;
    usedIcons[color] = new L.Icon(opts);
  }
  return usedIcons[color];
};
