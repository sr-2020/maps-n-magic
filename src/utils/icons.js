import L from 'leaflet/dist/leaflet-src';
import * as R from 'ramda';

const defaults = {
  shadowUrl: './images/leafletImages/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
};

const colorMap = {
  black: true,
  blue: true,
  green: true,
  grey: true,
  orange: true,
  red: true,
  violet: true,
  yellow: true,
};

const usedIcons = {};

const getIcon = color => {
  if (!colorMap[color]) {
    throw new Error(`Unexpected color ${color}`);
  }
  if (!usedIcons[color]) {
    const opts = R.clone(defaults);
    opts.iconUrl = `./images/leafletImages/marker-icon-2x-${color}.png`;
    usedIcons[color] = new L.Icon(opts);
  }
  return usedIcons[color];
};

export { getIcon };
