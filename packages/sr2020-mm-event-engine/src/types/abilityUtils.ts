import { CharacterModelData } from "./characterModelData";

// OwnSpirit = 'own-spirit', // способность видеть и ловить духов

export enum Ability {
  ArchMage = 'arch-mage', // архетип маг
  NiceSuit = 'nice-suit', // +30 минут к ношению духа
  LeisureSuit = 'leisure-suit', // +30 минут к ношению духа, требует nice-suit
  SuitUp = 'suit-up', // способность надевать духа
  FineHearing = 'fine-hearing', // способность видеть абилки духов
  SpiritMaster1 = 'spirit-master-1', // способность захватывать духов 1 ранга
  SpiritMaster2 = 'spirit-master-2', // способность захватывать духов 2 ранга
  SpiritMaster3 = 'spirit-master-3', // способность захватывать духов 3 ранга
  SpiritFeed = 'spirit-feed', // друг духов - увеличивает шанс поимки духа на 20% для орков
  SpiritKnown = 'spirit-known' // Знакомый духов (P) - увеличивает шанс поимки духа на 10% для всех
}

export enum Spell {
  SpiritCatcher = 'spirit-catcher',
  InputStream = 'input-stream',
  OutputStream = 'output-stream'
}

export function hasAbility(characterData: CharacterModelData, ability: Ability): boolean {
  const ab1 = characterData.workModel.passiveAbilities.some(el => el.id === ability);
  const ab2 = characterData.workModel.activeAbilities.some(el => el.id === ability);
  return ab1 || ab2;
}

export function hasSpell(characterData: CharacterModelData, spell: Spell): boolean {
  return characterData.workModel.spells.some(el => el.id === spell);
}

export function getSuitSpiritDurationItems(characterData: CharacterModelData): number {
  let durationItems = 1;
  if (hasAbility(characterData, Ability.NiceSuit)) {
    durationItems++;
  }
  if (hasAbility(characterData, Ability.LeisureSuit)) {
    durationItems++;
  }
  return durationItems;
}
