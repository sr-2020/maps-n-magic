export const AUDIO_RETRANSLATOR = {
  // SOUND_URL: 'http://localhost:3001',
  SOUND_URL: 'https://maps-n-magic.evarun.ru',
  // SOUND_URL: '',
  SOUND_LIST_ROUTE: '/fileList',
  SOUND_ROUTE: '/file',
};

export const SERVER_URL = 'http://localhost:3001';

export const POST_USER_POSITION = '/postUserPosition';

export function joinUrl(...args) {
  return args.join('');
}
