import * as R from 'ramda';

export function isGeoLocation(location) {
  return location.layer_id === 1 && !R.isEmpty(location.polygon);
}

const notEquals = R.pipe(R.equals, R.not);

export function getArrDiff(arr, prevArr, getKey, hasDifference = notEquals) {
  const arrIndex = R.indexBy(getKey, arr);
  const prevArrIndex = R.indexBy(getKey, prevArr);
  const arrKeys = R.keys(arrIndex);
  if (arrKeys.length !== arr.length) {
    console.error('arr keys are not unique');
  }
  const prevArrKeys = R.keys(prevArrIndex);
  if (prevArrKeys.length !== prevArr.length) {
    console.error('prevArr keys are not unique');
  }
  return R.union(arrKeys, prevArrKeys).reduce((acc, key) => {
    if (!!arrIndex[key] && !!prevArrIndex[key]) {
      if (hasDifference(arrIndex[key], prevArrIndex[key])) {
        acc.updated.push({
          item: arrIndex[key],
          prevItem: prevArrIndex[key],
        });
      }
    } else if (arrIndex[key]) {
      acc.added.push(arrIndex[key]);
    } else { // !!prevArrIndex[key]
      acc.removed.push(prevArrIndex[key]);
    }

    return acc;
  }, {
    added: [],
    updated: [],
    removed: [],
  });
}
