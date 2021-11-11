export type ConsequenceStatus = 'noConsequences' | 'woundConsequence' | 'deathConsequence';

export const consequenceTexts: Record<ConsequenceStatus, string> = {
  'noConsequences': 'Дух снят без негативных последствий',
  'woundConsequence': 'При снятии духа вы были ранены. Вычтите 2 хита.',
  'deathConsequence': 'Вы сняли духа слишком поздно и попали в клиническую смерть',
};