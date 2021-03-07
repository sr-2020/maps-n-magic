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
  global.window = {
    screen: {}
  };
  // @ts-ignore
  global.navigator = {
    userAgent: '',
    platform: ''
  };
  // @ts-ignore
  global.document = {
    documentElement: {
      style: {}
    },
    createElement: () => ({})
  };
}
