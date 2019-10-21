import srcData from "./14-09-2019_beacons.json";


const getBeacons = () => {
  // return srcData.features.filter(feature => feature.geometry.type === 'Point');
  return srcData.features.slice(0,10);
}

export {getBeacons};
