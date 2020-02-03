import srcData from '../dataAnalysis/14-09-2019_beacons.json';


const getBeacons = () => srcData.features.slice(0, 10);
// return srcData.features.filter(feature => feature.geometry.type === 'Point');

const getBeacons2 = () => {
  const beacons = getBeacons();
  return beacons.map((beacon) => ({
    name: beacon.properties.name,
    id: parseInt(beacon.properties.name, 10),
    lat: beacon.geometry.coordinates[1],
    lng: beacon.geometry.coordinates[0],
  }));
};

export { getBeacons, getBeacons2 };
