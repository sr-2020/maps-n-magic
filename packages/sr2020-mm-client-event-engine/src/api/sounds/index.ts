import { SOUND_URL } from '../settings';

// const {
//   SOUND_URL, SOUND_LIST_ROUTE, SOUND_ROUTE,
// } = AUDIO_RETRANSLATOR;

// function getUrl(...args: string[]): string {
  
//   // return SOUND_URL + args.join('');
//   return '/sounds' + args.join('');
// }

export const MANA_LEVEL_SOUNDS: Record<number, string> = {
  1: 'manaLevel_1.mp3',
  2: 'manaLevel_2.mp3',
  3: 'manaLevel_3.mp3',
  4: 'manaLevel_4.mp3',
  5: 'manaLevel_5.mp3',
  6: 'manaLevel_6.mp3',
  7: 'manaLevel_7.mp3',
};

export const FRACTION_SOUNDS: Record<number, string> = {
  2: 'spirit_barguzin_2.mp3',
  3: 'spirit_kultuk_3.mp3',
  4: 'spirit_sarma_4.mp3',
};

export const SOUND_LIST = [
  ...Object.values(MANA_LEVEL_SOUNDS),
  ...Object.values(FRACTION_SOUNDS),
]

export async function getSound(name: string, abortController: AbortController): Promise<ArrayBuffer> {
  // return fetch(getUrl(SOUND_ROUTE, '/', name), {
  const url = SOUND_URL + '/' + name;
  console.log(url);
  return fetch(url, {
    signal: abortController.signal,
  })
    .then((result) => {
      // TODO - make better error informing
      if (!result.ok) throw new Error(result.statusText);
      return result.arrayBuffer();
    });
}

// export async function getSoundList(abortController: AbortController) {
//   return fetch(getUrl(SOUND_LIST_ROUTE), {
//     signal: abortController.signal,
//   })
//     .then((result) => {
//       // TODO - make better error informing
//       if (!result.ok) throw new Error(result.statusText);
//       return result.json();
//     });
// }
