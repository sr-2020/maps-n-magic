import * as R from 'ramda';

export const fullDay = 24 * 60; // minutes in full day

const periodToPattern = (period) => ([
  { startTime: Math.floor((period / 8) * 0), value: -1 },
  { startTime: Math.floor((period / 8) * 1), value: 0 },
  { startTime: Math.floor((period / 8) * 3), value: 1 },
  { startTime: Math.floor((period / 8) * 5), value: 0 },
  { startTime: Math.floor((period / 8) * 7), value: -1 },
]);

export function getMoonActivity(period, offset) {
  let index = 0;
  const periodStarts = [];
  const offsetRemainder = offset % period;
  index = offsetRemainder - (offsetRemainder > 0 ? period : 0);
  while (index < fullDay) {
    periodStarts.push(index);
    index += period;
  }
  console.log(periodStarts);

  const pattern = periodToPattern(period);
  const addTimeToPattern = R.curry((pattern2, time) => pattern2.map((point) => ({ ...point, startTime: point.startTime + time })));
  const fullActivity = R.flatten(periodStarts.map(addTimeToPattern(pattern)));

  const activity = R.pipe(
    limitActivityToOneDay,
    addEndpointsToActivity(fullActivity),
    compactifyActivity,
    augmentActivityWithPairs,
  )(fullActivity);
  return activity;
}

function limitActivityToOneDay(fullActivity) {
  return fullActivity.filter(({ startTime }) => (startTime >= 0) && (startTime < fullDay));
}

function addEndpointsToActivity(fullActivity) {
  return (activity) => {
    const newActivity = [...activity];

    if (R.head(newActivity).startTime !== 0) {
      const nonNegativeTimeindex = fullActivity.findIndex((el) => el.startTime >= 0);
      const negativeEl = fullActivity[nonNegativeTimeindex - 1];
      newActivity.unshift({
        startTime: 0,
        value: negativeEl.value,
      });
    }
    if (R.last(newActivity).startTime !== fullDay) {
      newActivity.push({
        startTime: fullDay,
        value: R.last(newActivity).value,
      });
    }
    return newActivity;
  };
}

function compactifyActivity(activity) {
  const compactActivity = activity.filter((el, index, arr) => {
    if (index === 0) return true;
    if (index === (arr.length - 1)) return true;
    return el.value !== arr[index - 1].value;
  });

  console.log('compactify effect', 'before', activity.length, 'after', compactActivity.length);
  return compactActivity;
}

function augmentActivityWithPairs(activity) {
  return activity.map((el, index, arr) => {
    // if (index === 0) return true;
    if (index === (arr.length - 1)) return { ...el, intervalDuration: 0 };
    const nextEl = { ...arr[index + 1] };
    return {
      ...el,
      // nextEl,
      intervalDuration: nextEl.startTime - el.startTime,
    };
  });
}

export function mergeActivities(activity1, activity2) {
  const activity1ByTime = R.indexBy(R.prop('startTime'), activity1);
  const activity2ByTime = R.indexBy(R.prop('startTime'), activity2);

  const changeTimes = R.uniq([...R.pluck('startTime', activity1), ...R.pluck('startTime', activity2)]);
  changeTimes.sort((a, b) => a - b);
  // console.log(activity1);
  // console.log(changeTimes);
  // console.log(activity2);

  const { mergedActivity } = changeTimes.reduce((acc, time) => {
    const last1El = activity1ByTime[String(time)] || acc.last1El;
    const last2El = activity2ByTime[String(time)] || acc.last2El;
    acc.mergedActivity.push({
      startTime: time,
      value: last1El.value + last2El.value,
    });
    acc.last1El = last1El;
    acc.last2El = last2El;
    // console.log(last1El.value, last2El.value);
    return acc;
  }, {
    last1El: { value: 0 },
    last2El: { value: 0 },
    mergedActivity: [],
  });

  const activity = R.pipe(
    compactifyActivity,
    augmentActivityWithPairs,
  )(mergedActivity);

  return activity;
}

export function collectStatistics(activity) {
  const els = R.groupBy(R.prop('value'), activity);
  const range = R.range(-2, 3);
  range.forEach((level) => (els[level] = els[level] || []));

  return R.mapObjIndexed((arr) => R.sum(R.pluck('intervalDuration', arr)), els);
}
