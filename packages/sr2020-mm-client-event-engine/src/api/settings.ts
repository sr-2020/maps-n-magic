export const AUDIO_RETRANSLATOR = {
  // SOUND_URL: 'http://localhost:3001',
  SOUND_URL: 'https://maps-n-magic2.evarun.ru',
  // SOUND_URL: '',
  SOUND_LIST_ROUTE: '/fileList',
  SOUND_ROUTE: '/file',
};

export const SERVER_URL = 'http://localhost:3001';

export const POST_USER_POSITION = '/postUserPosition';

export function joinUrl(...args: string[]): string {
  return args.join('');
}

let WS_URL: string;
if (process.env.NODE_ENV === 'production') {
  WS_URL = 'wss://maps-n-magic2.evarun.ru/ws';
  // WS_URL = 'wss://localhost/ws';
} else {
  WS_URL = 'ws://localhost:3001/ws';
}

export { WS_URL };
