import * as R from 'ramda';

export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / (k ** i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatDuration(seconds, decimals = 0) {
  return `${seconds.toFixed(decimals)}s`;
  // if (bytes === 0) return '0 Bytes';

  // const k = 1024;
  // const dm = decimals < 0 ? 0 : decimals;
  // const sizes = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  // const i = Math.floor(Math.log(bytes) / Math.log(k));

  // return `${parseFloat((bytes / (k ** i)).toFixed(dm))} ${sizes[i]}`;
}

export function getEeStats(ee) {
  const names = ee.eventNames();
  return names.reduce((acc, name) => {
    acc[name] = ee.listeners(name).length;
    return acc;
  }, {});
}

// export function hardDispose(obj) {
//   return Object.keys(obj).forEach((key) => { delete obj[key]; });
// }
