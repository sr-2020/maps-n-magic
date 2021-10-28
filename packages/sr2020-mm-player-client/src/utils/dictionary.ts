import { translitRuEn } from "sr2020-mm-event-engine";
import { dictionary as dictionary_en } from "./dictionary_en";
import { dictionary as dictionary_ru } from "./dictionary_ru";

const REACT_APP_LANG = (process.env.REACT_APP_LANG || '').toLowerCase();

console.log('REACT_APP_LANG', REACT_APP_LANG);

const lang = ['ru', 'en'].includes(REACT_APP_LANG) ? REACT_APP_LANG : 'ru';

function isRu() {
  return lang === 'ru';
}

export const dictionary = isRu() ? dictionary_ru : dictionary_en;

// SuitSpiritPage.tsx
export function spiritSuitTime(timeInSpirit: number) {
  return isRu() ?
    `Время ношения духа ${timeInSpirit} минут` :
    `You can wear spirit ${timeInSpirit} minutes`;
}

// SpiritPage.tsx
export function emptinessReason(emptinessReason: string | undefined) {
  return isRu() ?
    `Причина: ${emptinessReason}` :
    `Reason: ${emptinessReason}`;
}


// SpiritList.tsx
export function spiritListTitle(spiritNumber: number) {
  return isRu() ?
    `Духи (${spiritNumber})` :
    `Spirits (${spiritNumber})`;
}

export function needAbilityToCatchSpirit(spiritMasterName: string) {
  return isRu() ?
    `Для ловли духа нужна способность ${spiritMasterName}` :
    `You need ability ${spiritMasterName} to catch spirit`;
}

export function catchSpiritInfoText(
  attemptNumber: number, 
  tillTime: string,
  catchProbability: number, 
) {
  return isRu() ?
    `У вас ${attemptNumber} попытки до ${tillTime}, вероятность поимки ${catchProbability}%` :
    `You have ${attemptNumber} attempts till ${tillTime}, catch probability ${catchProbability}%`;
}

export function processForDisplay(str: string): string {
  return isRu() ? (str) : translitRuEn(str);
}

const fractionNameObj_ru: Record<number, string> = {
  1: "Без фракции",
  2: "Баргузин",
  3: "Култук",
  4: "Сарма",
};

const fractionNameObj_en: Record<number, string> = {
  1: "No fraction",
  2: "Barguzin",
  3: "Kultuk",
  4: "Sarma",
};

export function getFractionName(id: number): string {
  return isRu() ?
    fractionNameObj_ru[id] || '' :
    fractionNameObj_en[id] || '' ;
}