export * from './loginManager';
export * from './soundStageStateMaker';

const fractionNameObj: Record<number, string> = {
  1: "Без фракции",
  2: "Баргузин",
  3: "Култук",
  4: "Сарма",
};

export function getFractionName(id: number): string {
  return fractionNameObj[id] || '';
}