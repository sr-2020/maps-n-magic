// export * from './index_ru';
// export * from './index_en';

import { appDictionary as appDictionary_ru } from './app_ru';
import { spiritDictionary as spiritDictionary_ru } from './spirits_ru';
import { manaOceanDictionary as manaOceanDictionary_ru } from './manaOcean_ru';
import { soundDictionary as soundDictionary_ru } from './sounds_ru';
import { gameConstantsDictionary as gameConstantsDictionary_ru } from './gameConstants_ru';
import { miscDictionary as miscDictionary_ru } from './misc_ru';
import { extraMainServerI18nDictionary as extraMainServerI18nDictionary_ru } from './extraMainServerI18n_ru';
import * as leaflet_ru from './leaflet_ru';

import { appDictionary as appDictionary_en } from './app_en';
import { spiritDictionary as spiritDictionary_en } from './spirits_en';
import { manaOceanDictionary as manaOceanDictionary_en } from './manaOcean_en';
import { soundDictionary as soundDictionary_en } from './sounds_en';
import { gameConstantsDictionary as gameConstantsDictionary_en } from './gameConstants_en';
import { miscDictionary as miscDictionary_en } from './misc_en';
import { extraMainServerI18nDictionary as extraMainServerI18nDictionary_en } from './extraMainServerI18n_en';
import * as leaflet_en from './leaflet_en';

import { translitRuEn } from "./translit";

export const leafletI18n = {
  ru: leaflet_ru,
  en: leaflet_en,
};

export const defaultLang = 'ru';
// export const defaultLang = 'en';

export const resources = {
  ru: {
    translation: {
      ...miscDictionary_ru,
      ...appDictionary_ru,
      ...spiritDictionary_ru,
      ...soundDictionary_ru,
      ...manaOceanDictionary_ru,
      ...gameConstantsDictionary_ru,
      ...extraMainServerI18nDictionary_ru,
    },
  },
  en: {
    translation: {
      ...miscDictionary_en,
      ...appDictionary_en,
      ...spiritDictionary_en,
      ...soundDictionary_en,
      ...manaOceanDictionary_en,
      ...gameConstantsDictionary_en,
      ...extraMainServerI18nDictionary_en,
    },
  },
} as const;


export function processForDisplay(str: string): string {
  return defaultLang as string === 'en' ? translitRuEn(str) : str;
}