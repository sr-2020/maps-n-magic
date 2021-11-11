import * as R from 'ramda';
// import R from 'ramda';
// import * as moment from 'moment-timezone'; // works in browser
import moment from 'moment-timezone'; // works in node js

import { ManaOceanSettingsData, MoonProps, TidePeriodProps } from "../domain";

export const fullDay: number = 24 * 60; // minutes in full day

// const periodToPattern = (period) => ([
//   { startTime: Math.floor((period / 8) * 0), value: -1 },
//   { startTime: Math.floor((period / 8) * 1), value: 0 },
//   { startTime: Math.floor((period / 8) * 3), value: 1 },
//   { startTime: Math.floor((period / 8) * 5), value: 0 },
//   { startTime: Math.floor((period / 8) * 7), value: -1 },
// ]);

const periodToPattern = (period: number): TidePeriodProps[] => ([
  { startTime: 0, value: -1 },
  { startTime: Math.ceil((period / 8) * 1), value: 0 },
  { startTime: Math.ceil((period / 8) * 3), value: 1 },
  { startTime: Math.ceil((period / 8) * 5), value: 0 },
  { startTime: Math.ceil((period / 8) * 7), value: -1 },
]);
// const periodToPattern2 = (period) => ([
//   { startTime: ((period / 8) * 0), value: -1 },
//   { startTime: ((period / 8) * 1), value: 0 },
//   { startTime: ((period / 8) * 3), value: 1 },
//   { startTime: ((period / 8) * 5), value: 0 },
//   { startTime: ((period / 8) * 7), value: -1 },
// ]);

export function getMoscowTime(): {
  moscowTime: moment.Moment,
  moscowTimeInMinutes: number
} {
  // console.log('moment', moment);
  const moscowTime = moment().tz('Europe/Moscow');

  const moscowTimeInMinutes = moscowTime.hour() * 60 + moscowTime.minute();
  return {
    moscowTime,
    moscowTimeInMinutes,
  };
}

// export function getMoonActivity(period, offset) {
export function getMoonActivity(moonProps: MoonProps): TidePeriodProps[] {
  const { period, offset } = moonProps;
  let index: number = 0;
  const periodStarts: number[] = [];
  const offsetRemainder: number = offset % period;
  index = offsetRemainder - (offsetRemainder > 0 ? period : 0);
  while (index < fullDay) {
    periodStarts.push(index);
    index += period;
  }
  // console.log(periodStarts);

  const pattern: TidePeriodProps[] = periodToPattern(period);
  // console.log('pattern', pattern);
  // console.log('pattern2', periodToPattern2(period));
  const addTimeToPattern = (time: number) => 
    pattern.map((point: TidePeriodProps): TidePeriodProps => 
      ({ ...point, startTime: point.startTime + time }));
  const fullActivity: TidePeriodProps[] = R.flatten(periodStarts.map(addTimeToPattern));
      // const addTimeToPattern = R.curry((pattern2: TidePeriodProps[], time: number) => 
  //   pattern2.map((point: TidePeriodProps): TidePeriodProps => 
  //     ({ ...point, startTime: point.startTime + time })));
  // @ts-ignore
  // const fullActivity = R.flatten(periodStarts.map(addTimeToPattern(pattern)));

  const activity: TidePeriodProps[] = R.pipe(
    limitActivityToOneDay,
    addEndpointsToActivity(fullActivity),
    compactifyActivity,
    augmentActivityWithPairs,
  )(fullActivity);
  return activity;
}

function limitActivityToOneDay(fullActivity: TidePeriodProps[]): TidePeriodProps[] {
  return fullActivity.filter(({ startTime }) => (startTime >= 0) && (startTime < fullDay));
}

function addEndpointsToActivity(fullActivity: TidePeriodProps[]) {
  return (activity: TidePeriodProps[]): TidePeriodProps[] => {
    const newActivity: TidePeriodProps[] = [...activity];

    const head = R.head(newActivity);
    if (head !== undefined && head.startTime !== 0) {
      const nonNegativeTimeindex = fullActivity.findIndex((el) => el.startTime >= 0);
      const negativeEl = fullActivity[nonNegativeTimeindex - 1];
      newActivity.unshift({
        startTime: 0,
        value: negativeEl.value,
      });
    }
    const last = R.last(newActivity);
    if (last !== undefined && last.startTime !== fullDay) {
      newActivity.push({
        startTime: fullDay,
        value: last.value,
      });
    }
    return newActivity;
  };
}

function compactifyActivity(activity: TidePeriodProps[]): TidePeriodProps[] {
  const compactActivity: TidePeriodProps[] = activity.filter((el, index, arr) => {
    if (index === 0) return true;
    if (index === (arr.length - 1)) return true;
    return el.value !== arr[index - 1].value;
  });

  // console.log('compactify effect', 'before', activity.length, 'after', compactActivity.length);
  return compactActivity;
}

function augmentActivityWithPairs(activity: TidePeriodProps[]): TidePeriodProps[] {
  return activity.map((el, index, arr) => {
    // if (index === 0) return true;
    if (index === (arr.length - 1)) return { ...el, intervalDuration: 0 };
    const nextEl: TidePeriodProps = { ...arr[index + 1] };
    return {
      ...el,
      // nextEl,
      intervalDuration: nextEl.startTime - el.startTime,
    } as TidePeriodProps;
  });
}

export function mergeActivities(
  activity1: TidePeriodProps[], 
  activity2: TidePeriodProps[]
): TidePeriodProps[] {
  const activity1ByTime: {
    [x: number]: TidePeriodProps;
  } = R.indexBy(R.prop('startTime'), activity1);
  const activity2ByTime: {
    [x: number]: TidePeriodProps;
  } = R.indexBy(R.prop('startTime'), activity2);

  const changeTimes: number[] = R.uniq([...R.pluck('startTime', activity1), ...R.pluck('startTime', activity2)]);
  changeTimes.sort((a, b) => a - b);
  // console.log(activity1);
  // console.log(changeTimes);
  // console.log(activity2);

  const { mergedActivity }: {
    mergedActivity: TidePeriodProps[],
  } = changeTimes.reduce((acc, time) => {
    const last1El: TidePeriodProps = activity1ByTime[(time)] || acc.last1El;
    const last2El: TidePeriodProps = activity2ByTime[(time)] || acc.last2El;
    acc.mergedActivity.push({
      startTime: time,
      value: last1El.value + last2El.value,
    });
    acc.last1El = last1El;
    acc.last2El = last2El;
    // console.log(last1El.value, last2El.value);
    return acc;
  }, {
    last1El: { value: 0, startTime: -1 },
    last2El: { value: 0, startTime: -1 },
    mergedActivity: [],
  } as {
    last1El: TidePeriodProps,
    last2El: TidePeriodProps,
    mergedActivity: TidePeriodProps[],
  });

  const activity: TidePeriodProps[] = R.pipe(
    compactifyActivity,
    augmentActivityWithPairs,
  )(mergedActivity);

  return activity;
}

export function collectStatistics(activity: TidePeriodProps[]): Record<string, number> {
  // @ts-ignore
  const els = R.groupBy(R.prop('value'), activity);
  const range: number[] = R.range(-2, 3);
  range.forEach((level) => (els[level] = els[level] || []));

  // @ts-ignore
  return R.mapObjIndexed((arr) => R.sum(R.pluck('intervalDuration', arr)), els);
}

const hitStat = {
  hitFirst: 0,
  hitLast: 0,
  hitMid: 0,
  hitSmallestInterval: 0,
};

function getTideHeightRef(time: number, moonPropsList: MoonProps[], log = false) {
  const activity = makeActivityArr(moonPropsList);
  if (log) console.log(`find ${time}`);
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
    if (log) console.log(first, activity[first].startTime, activity[first].value, '-', last, activity[last].startTime, activity[last].value);
    if (time === activity[first].startTime) {
      if (log) console.log('hit first');
      hitStat.hitFirst++;
      return activity[first].value;
    }
    if (time === activity[last].startTime) {
      if (log) console.log('hit last');
      hitStat.hitLast++;
      return activity[last].value;
    }
    if ((last - first) === 1) {
      if (log) console.log('hit smallest interval');
      hitStat.hitSmallestInterval++;
      return activity[first].value;
    }
    const mid = Math.floor((first + last) / 2);
    if (time === activity[mid].startTime) {
      if (log) console.log('hit mid');
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

function getTideLevelByPeriodPart(periodPart: number): number {
  switch (periodPart) {
  case 0: case 7:
    return -1;
  case 1: case 2: case 5: case 6:
    return 0;
  case 3: case 4:
    return 1;
  default:
    throw new Error(`Unexpected period part ${periodPart}`);
  }
}

export function getTideHeight2(
  time: number, 
  manaOceanSettings: ManaOceanSettingsData
): number {
  return getTideHeight(time, [{
    period: manaOceanSettings.visibleMoonPeriod,
    offset: manaOceanSettings.visibleMoonNewMoonTime,
  }, {
    period: manaOceanSettings.invisibleMoonPeriod,
    offset: manaOceanSettings.invisibleMoonNewMoonTime,
  }]);
}

function getTideHeight(time: number, moonPropsList: MoonProps[]): number {
  // console.log(time);

  return R.sum(moonPropsList.map((moonProps) => {
    let time2 = time - moonProps.offset;
    // let offset2 = moonProps.offset % moonProps.period;
    if (time2 < 0) {
      time2 += moonProps.period;
    }
    // const remTime = (time - offset2) % moonProps.period;
    const remTime = time2 % moonProps.period;
    const periodPart = Math.floor((remTime / moonProps.period) * 8);
    const effect = getTideLevelByPeriodPart(periodPart);
    // console.log('time', time, 'periodPart', periodPart, 'rawPeriodPart', ((remTime / moonProps.period) * 8).toFixed(2), 'effect', effect);
    return effect;
  }));
}

// const moonPropsList = [{
//   period: 180,
//   offset: 0,
// // }, {
// //   period: 270,
// //   offset: 0,
// }];
// const moonPropsList = [{
//   period: 180,
//   offset: 0,
// }, {
//   period: 270,
//   offset: 0,
// }];
// const moonPropsList = [{
//   period: 180,
//   offset: 60,
// // }, {
// //   period: 270,
// //   offset: 0,
// }];
const moonPropsList: MoonProps[] = [{
  period: 180,
  offset: 120,
}, {
  period: 270,
  offset: 120,
}];

function makeActivityArr(moonPropsList2: MoonProps[]): TidePeriodProps[] {
  return moonPropsList2.reduce((acc, moonProps) => {
    const newActivity = getMoonActivity(moonProps);
    return mergeActivities(acc, newActivity);
  }, [] as TidePeriodProps[]);
}

function manaHeightStats(manaHeightList: string[]) {
  return manaHeightList.reduce((acc, num) => {
    const key = Number(num);
    if (acc[key] === undefined) {
      acc[key] = 0;
    } else {
      acc[key]++;
    }
    return acc;
  }, {} as Record<number, number>);
}

// const activity = makeActivityArr(moonPropsList);
// console.log(activity);

// const range = R.range(0, fullDay + 1);
// // const range = R.range(0, 35 + 1);
// const manaHeightListRef = range.map((num) => getTideHeightRef(num, moonPropsList));
// console.log(manaHeightStats(manaHeightListRef));
// const manaHeightList = range.map((num) => getTideHeight(num, moonPropsList));
// console.log(manaHeightStats(manaHeightList));

// const diffArr = range.filter((time) => manaHeightListRef[time] !== manaHeightList[time]).map((time) => ({
//   time, refVal: manaHeightListRef[time], val: manaHeightList[time],
// }));

// if (diffArr.length === 0) {
//   console.log('No difference between ref array and single point calc value');
// } else {
//   diffArr.forEach(({ time, refVal, val }) => {
//     console.log(`difference in time ${time}, refVal ${refVal}, val ${val}`);
//   });
// }

// // R.range(0, fullDay + 1).forEach((num) => console.log(`${getTideHeightRef(num, moonPropsList)}\n`));
// // R.range(0, fullDay + 1).forEach((num) => console.log(`${getTideHeight(num, moonPropsList)}\n`));
// R.range(0, 15).map(R.multiply(100)).forEach((num) => console.log(`${getTideHeight(num, moonPropsList)}\n`));
// // console.log(getTideHeight(720, activity));
// console.log('activity', activity.length);
// console.log(JSON.stringify(hitStat, null, '  '));
