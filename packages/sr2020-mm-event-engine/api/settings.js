export const AUDIO_RETRANSLATOR = {
  // SOUND_URL: 'http://localhost:3001',
  // SOUND_URL: 'http://localhost:3001',
  // SOUND_URL: 'https://larp-nims.org:3001',
  SOUND_URL: 'https://maps-n-magic.evarun.ru',
  // SOUND_URL: '',
  SOUND_LIST_ROUTE: '/fileList',
  SOUND_ROUTE: '/file',
};

let WS_URL;
if (process.env.NODE_ENV === 'production') {
  WS_URL = 'wss://maps-n-magic.evarun.ru/ws';
} else {
  WS_URL = 'ws://localhost:3001/ws';
}

export { WS_URL };
