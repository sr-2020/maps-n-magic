import * as R from 'ramda';
// import R from 'ramda';

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
  // console.log(periodStarts);

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

const hitStat = {
  hitFirst: 0,
  hitLast: 0,
  hitMid: 0,
  hitSmallestInterval: 0,
};

function getTideHeightRef(time, moonPropsList) {
  const activity = makeActivityArr(moonPropsList);
  console.log(`find ${time}`);
  if (R.isEmpty(activity)) {
    return 0;
  }
  if (R.length(activity) === 1) {
    return activity[0].value;
  }
  let first = 0;
  let last = activity.length - 1;

  let iterationCount = 0;

  while (iterationCount < activity.length) {
    console.log(first, activity[first].startTime, activity[first].value, '-', last, activity[last].startTime, activity[last].value);
    if (time === activity[first].startTime) {
      console.log('hit first');
      hitStat.hitFirst++;
      return activity[first].value;
    }
    if (time === activity[last].startTime) {
      console.log('hit last');
      hitStat.hitLast++;
      return activity[last].value;
    }
    if ((last - first) === 1) {
      console.log('hit smallest interval');
      hitStat.hitSmallestInterval++;
      return activity[first].value;
    }
    const mid = Math.floor((first + last) / 2);
    if (time === activity[mid].startTime) {
      console.log('hit mid');
      hitStat.hitMid++;
      return activity[mid].value;
    }
    if (time > activity[mid].startTime) {
      first = mid;
    } else {
      last = mid;
    }
    iterationCount++;
  }

  throw new Error(`Too much iterations in tide height search ${time} ${JSON.stringify(activity)}`);
}

function getTideHeight(time, moonPropsList) {
  return 0;
}


const moonPropsList = [{
  period: 180,
  offset: 180,
}, {
  period: 270,
  offset: 120,
}];

function makeActivityArr(moonPropsList2) {
  return moonPropsList2.reduce((acc, moonProps) => {
    const newActivity = getMoonActivity(moonProps.period, moonProps.offset);
    return mergeActivities(acc, newActivity);
  }, []);
}

// const activity = makeActivityArr(moonPropsList);
// console.log(activity);

// // R.range(0, fullDay + 1).forEach((num) => console.log(`${getTideHeightRef(num, moonPropsList)}\n`));
// R.range(0, fullDay + 1).forEach((num) => console.log(`${getTideHeight(num, moonPropsList)}\n`));
// // console.log(getTideHeight(720, activity));
// console.log('activity', activity.length);
// console.log(JSON.stringify(hitStat, null, '  '));
