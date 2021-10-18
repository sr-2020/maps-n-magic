import { LifeStylesValues } from "../ext-billing";
import { LocationRecord } from "../ext-position";

export interface RawCharacterHealthState {
  //   55817: {locationId: 3215, locationLabel: "Межрайонье 1", healthState: "clinically_dead",…}
  // healthState: "clinically_dead"
  healthState: string;
  // lifeStyle: "<lifeStyle>"
  // lifeStyle: string;
  lifeStyle: LifeStylesValues;
  // locationId: 3215
  locationId: number | null;
  // locationLabel: "<locationLabel>"
  locationLabel: string;
  // personName: "Blaze ноябрь"
  personName: string;
  // timestamp: 1613673901135
  timestamp: number;
}

export interface CharacterHealthState extends RawCharacterHealthState {
  characterId: number;
}

export type CharacterHealthStates = {
  [id: number]: RawCharacterHealthState;
}

export interface CharacterHealthStatesByLocation {
  characters: CharacterHealthState[];
  location: LocationRecord;
  locationId: number;
}
