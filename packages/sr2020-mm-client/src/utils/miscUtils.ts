import EventEmitter from 'events';
import * as R from 'ramda';

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / (k ** i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatDuration(seconds: number, decimals = 0): string {
  return `${seconds.toFixed(decimals)}s`;
  // if (bytes === 0) return '0 Bytes';

  // const k = 1024;
  // const dm = decimals < 0 ? 0 : decimals;
  // const sizes = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  // const i = Math.floor(Math.log(bytes) / Math.log(k));

  // return `${parseFloat((bytes / (k ** i)).toFixed(dm))} ${sizes[i]}`;
}

export function getEeStats(ee: EventEmitter) {
  const names = ee.eventNames() as string[];
  return names.reduce((acc, name) => {
    acc[name] = ee.listeners(name).length;
    return acc;
  }, {} as Record<string, number>);
}

// export function hardDispose(obj) {
//   return Object.keys(obj).forEach((key) => { delete obj[key]; });
// }
