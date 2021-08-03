export enum LifeStyles {
  Unknown = 'Unknown',
  Wood = 'Wood',
  Bronze = 'Bronze',
  Silver = 'Silver',
  Gold = 'Gold',
  Platinum = 'Platinum',
  Iridium = 'Iridium',
};
export const lifeStyleList: LifeStyles[] = [
  LifeStyles.Unknown,
  LifeStyles.Wood,
  LifeStyles.Bronze,
  LifeStyles.Silver,
  LifeStyles.Gold,
  LifeStyles.Platinum,
  LifeStyles.Iridium,
];

export const lifeStyleScore = {
  Unknown: -1,
  Wood: 1,
  Bronze: 2,
  Silver: 3,
  Gold: 4,
  Platinum: 5,
  Iridium: 6,
};

export type LifeStylesValues = keyof typeof LifeStyles;

export enum BodyConditions {
  Healthy = 'healthy',
  Wounded = 'wounded',
  Clinically_dead = 'clinically_dead',
  Biologically_dead = 'biologically_dead',
};

export const bodyConditionsList: BodyConditions[] = [
  BodyConditions.Healthy,
  BodyConditions.Wounded,
  BodyConditions.Clinically_dead,
  BodyConditions.Biologically_dead,
];

export type BodyConditionValues = Lowercase<keyof typeof BodyConditions>;

export enum TimeoutType {
  'rotationTimeout',
  'rotationSoundTimeout'
};