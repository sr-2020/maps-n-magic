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

// from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export function shuffle(array) {
  array = [...array];
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export function isGeoLocation(location) {
  return location.layer_id === 1 && !R.isEmpty(location.polygon);
}
