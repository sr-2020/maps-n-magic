import { AUDIO_RETRANSLATOR } from '../settings';

const {
  SOUND_URL, SOUND_LIST_ROUTE, SOUND_ROUTE,
} = AUDIO_RETRANSLATOR;

function getUrl(...args: string[]): string {
  return SOUND_URL + args.join('');
}

export async function getSound(name: string, abortController: AbortController): Promise<ArrayBuffer> {
  return fetch(getUrl(SOUND_ROUTE, '/', name), {
    signal: abortController.signal,
  })
    .then((result) => {
      // TODO - make better error informing
      if (!result.ok) throw new Error(result.statusText);
      return result.arrayBuffer();
    });
}

export async function getSoundList(abortController: AbortController) {
  return fetch(getUrl(SOUND_LIST_ROUTE), {
    signal: abortController.signal,
  })
    .then((result) => {
      // TODO - make better error informing
      if (!result.ok) throw new Error(result.statusText);
      return result.json();
    });
}
