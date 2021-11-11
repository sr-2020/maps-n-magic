import { LifeStyles, LifeStylesValues } from "./lifeStyle";

export interface CharacterLifeStyle {
  id: number;
  lifeStyle: LifeStylesValues,
  personName: string,
}

export const unknownLifeStyle: Omit<CharacterLifeStyle, "id"> = {
  lifeStyle: LifeStyles.Unknown,
  personName: 'N/A',
};