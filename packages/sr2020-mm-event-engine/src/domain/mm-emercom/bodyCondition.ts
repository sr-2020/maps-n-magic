import { RawCharacterHealthState } from "./characterHealthState";

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

export const isClinicallyDead = (charState: RawCharacterHealthState): boolean => 
  charState.healthState === BodyConditions.Clinically_dead;

export const isBiologicallyDead = (charState: RawCharacterHealthState): boolean => 
  charState.healthState === BodyConditions.Biologically_dead;

export const isDead = (charState: RawCharacterHealthState): boolean => 
  isClinicallyDead(charState) || isBiologicallyDead(charState);

export const healthStateShortNames: Record<string, string> = {
  'healthy': 'ЗД',
  'wounded': 'ТЯЖ',
  'clinically_dead': 'КС',
  'biologically_dead': 'АС',
};