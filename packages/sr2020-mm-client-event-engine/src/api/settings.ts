// export const AUDIO_RETRANSLATOR = {
//   // SOUND_URL: 'http://localhost:3001',
//   SOUND_URL: 'https://storage.googleapis.com/sr2020-maps-n-magic',
//   // SOUND_URL: '',
//   SOUND_LIST_ROUTE: '/fileList',
//   SOUND_ROUTE: '/file',
// };

let SOUND_URL: string;
if (process.env.NODE_ENV === 'production') {
  SOUND_URL = 'https://storage.googleapis.com/sr2020-maps-n-magic';
  // WS_URL = 'ws://localhost:3001/api/ws';
} else {
  SOUND_URL = 'https://storage.googleapis.com/sr2020-maps-n-magic';
  // SOUND_URL = '/sounds';
}

export { SOUND_URL };


// export const SERVER_URL = 'http://localhost:3001';
export const SERVER_URL = '';

export const POST_USER_POSITION = '/api/postUserPosition';

export function joinUrl(...args: string[]): string {
  return args.join('');
}

let WS_URL: string;
if (process.env.NODE_ENV === 'production') {
  WS_URL = 'wss://maps-n-magic2.evarun.ru/api/ws';
  // WS_URL = 'ws://localhost:3001/api/ws';
} else {
  WS_URL = 'ws://localhost:3001/api/ws';
}

export { WS_URL };
