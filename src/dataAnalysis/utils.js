exports.removeAllEmptyMessages = function (data) {
  return data.filter((item) => item.beacons.length !== 0);
};


exports.getClosestBeacon = function (beaconsArr) {
  if (beaconsArr.length === 1) {
    return beaconsArr[0];
  }
  return beaconsArr.reduce((closest, beacon) => (closest.level > beacon.level ? closest : beacon), beaconsArr[0]);
};
