import { AUDIO_RETRANSLATOR } from '../settings';

const {
  SOUND_URL, SOUND_LIST_ROUTE, SOUND_ROUTE,
} = AUDIO_RETRANSLATOR;

function getUrl(...args) {
  return SOUND_URL + args.join('');
}

export async function getSound(name, abortController) {
  return fetch(getUrl(SOUND_ROUTE, '/', name), {
    signal: abortController.signal,
  })
    .then((result) => {
      if (!result.ok) throw new Error(result);
      return result.arrayBuffer();
    });
}

export async function getSoundList(abortController) {
  return fetch(getUrl(SOUND_LIST_ROUTE), {
    signal: abortController.signal,
  })
    .then((result) => {
      if (!result.ok) throw new Error(result);
      return result.json();
    });
}
