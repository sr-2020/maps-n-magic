import { CharacterModelData } from "../ext-model-engine";

export enum Spell {
  SpiritCatcher = 'spirit-catcher',
  InputStream = 'input-stream',
  OutputStream = 'output-stream'
}

export function hasSpell(characterData: CharacterModelData, spell: Spell): boolean {
  return characterData.workModel.spells.some(el => el.id === spell);
}