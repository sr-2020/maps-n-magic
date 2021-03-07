// from https://stackoverflow.com/questions/17575790/environment-detection-node-js-or-browser
let isNode = false;
if (typeof process === 'object') {
  if (typeof process.versions === 'object') {
    if (typeof process.versions.node !== 'undefined') {
      isNode = true;
    }
  }
}

if (isNode) {
  // @ts-ignore
  delete global.window;
  // @ts-ignore
  delete global.document;
  // @ts-ignore
  delete global.navigator;
}
