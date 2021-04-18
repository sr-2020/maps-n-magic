import L, { IconOptions, Icon } from 'leaflet';
import * as R from 'ramda';

const defaults: IconOptions = {
  shadowUrl: './images/leafletImages/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  iconUrl: `./images/leafletImages/marker-icon-2x.png`
};

export enum iconColors {
  black = 'black',
  blue = 'blue',
  green = 'green',
  grey = 'grey',
  orange = 'orange',
  red = 'red',
  violet = 'violet',
  yellow = 'yellow',
};

const usedIcons: {
  [color in iconColors]?: Icon
} = {};

export const getIcon = (color: iconColors): L.Icon<L.IconOptions> => {
  // if (iconColors[color] !== undefined) {
  //   throw new Error(`Unexpected color ${color}`);
  // }
  let icon = usedIcons[color];
  if (icon !== undefined) {
    return icon;
  } else {
    const opts = R.clone(defaults);
    opts.iconUrl = `./images/leafletImages/marker-icon-2x-${color}.png`;
    icon = new L.Icon(opts);
    usedIcons[color] = icon;
    return icon;
  }
};
