import * as R from 'ramda';

export function cleanRawData(rawDataArr, beaconLatlngsIndex) {
  // const { beaconLatlngsIndex } = this.props;
  const res = rawDataArr.slice(0, 100).map((el) => ({
  // const res = rawDataArr.map((el) => ({
    // const res = rawDataArr.filter(R.pipe(R.prop('loudestBeacon'), R.isNil, R.not)).map((el) => ({
    ...el,
    level: el.loudestBeacon ? el.loudestBeacon.level : -120,
    // eslint-disable-next-line no-nested-ternary
    placement: el.loudestBeacon
      ? (beaconLatlngsIndex[el.loudestBeacon.beaconId] ? 'outdoors' : 'indoors')
      : null,
  }));
  const res2 = R.groupBy((el) => (!el.loudestBeacon ? 'emptyMessages' : el.placement), res);
  const filter = R.pipe(R.prop('loudestBeacon'), R.isNil, R.not);
  const makeIndex = R.indexBy(R.path(['loudestBeacon', 'beaconId']));
  const getBeaconIds = R.pipe(R.filter(filter), makeIndex, R.keys);

  const beaconIds = getBeaconIds(rawDataArr);

  return {
    res: res2,
    beaconIds,
  };
}
