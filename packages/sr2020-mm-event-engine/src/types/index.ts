import L from 'leaflet';

import * as ManaOcean from "./manaOcean";
import { SRLatLng, LocationRecord } from "./locations";
export * from "./enums";
export * from "./manaOcean";
export * from "./features";
export * from "./spirits";
export * from "./misc";
export * from "./beacons";
export * from "./locations";

import { LifeStylesValues } from "./enums";

export interface IntegerIdentifiable {
  id: number;
}
export interface StringIdentifiable {
  id: string;
}

export type Identifiable = IntegerIdentifiable | StringIdentifiable;





// EdgeId format `${locId1}_${locId2}` 
// where locIds are numbers.
export type EdgeId = string;

export interface TriangulationCentroid {
  locationId: number;
  centroidLatLng: SRLatLng;
}

export interface TriangulationData {
  neighborsIndex: Map<number, number[]>;
  centroids: TriangulationCentroid[];
  edgeSet: Set<EdgeId>;
}

// export interface RawCharacterHealthState {
//   //   55817: {locationId: 3215, locationLabel: "Межрайонье 1", healthState: "clinically_dead",…}
//   // healthState: "clinically_dead"
//   // TODO add enum here
//   healthState: string;
//   // lifeStyle: "Страховка отсутствует"
//   // locationId: 3215
//   locationId: number;
//   // locationLabel: "Межрайонье 1"
//   // personName: "Blaze ноябрь"
//   // timestamp: 1613673901135
//   timestamp: number;
// }

export interface SettingsData {

}

export interface SettingsCatalog {
  manaOcean?: ManaOcean.ManaOceanSettingsData;
  manaOceanEffects?: ManaOcean.ManaOceanEffectSettingsData
};

export type SettingsKeys = keyof SettingsCatalog;

export type SettingsValues = 
  ManaOcean.ManaOceanSettingsData | 
  ManaOcean.ManaOceanEffectSettingsData;

export interface CharacterLocationData {
  characterId: number;
  locationId: number;
  prevLocationId: number | null;
};


export interface RawCharacterHealthState {
  //   55817: {locationId: 3215, locationLabel: "Межрайонье 1", healthState: "clinically_dead",…}
  // healthState: "clinically_dead"
  healthState: string;
  // lifeStyle: "Страховка отсутствует"
  // lifeStyle: string;
  lifeStyle: LifeStylesValues;
  // locationId: 3215
  locationId: number | null;
  // locationLabel: "Межрайонье 1"
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


export interface SpellCast {
  // timestamp: moment.utc().valueOf(), // Unix time в миллисекундах
  timestamp: number;
  // // id: 'stone-skin', // id спелла из сводной таблички
  // // name: 'Skin stoner', // человекочитаемое название спелла
  // // id: 'input-stream', // id спелла из сводной таблички
  // id: spellSwitch ? 'input-stream' : 'output-stream', // id спелла из сводной таблички
  id: string;
  // name: 'Input Stream', // человекочитаемое название спелла
  name: string;
  // // characterId: '10198', // персонаж применивший спелл
  // characterId: '51935', // персонаж применивший спелл
  characterId: string;
  // location: {
  //   // id: 3065, // район силовиков
  //   // id: 3048,
  //   id: sample(locArr),
  //   manaLevel: 10,
  // },
  location: {
    id: number;
  };
  // power: 7, // мощь спелла
  power: number;
  // // power: 4, // мощь спелла
  // reagentIds: ['123', '321'], // идентификаторы QR-ов реагентов
  // // ritualMembersIds: [], // идентификаторы участников ритуала
  // // ritualVictimIds: [], // идентификаторы жертв ритуала
  // // reagentIds: ['123', '321'], // идентификаторы QR-ов реагентов
  // ritualMembersIds: ['555', '666'], // идентификаторы участников ритуала
  // ritualVictimIds: ['111', '222'], // идентификаторы жертв ритуала
  ritualMembersIds: string[],
  ritualVictimIds: string[],
  // // целевой персонаж (если данная способность имеет целевого персонажа),
  // // иначе пусто
  // targetCharacterId: '10246',
}

// export type RectLatLngs = L.LatLng[][] | L.LatLng[] | L.LatLng[][][];
// export type RectLatLngs = L.LatLng[][];

export interface BackgroundImage {
  latlngs: L.LatLngLiteral[][];
  image: string;
  id: number;
  name: string;
}

export interface SoundStageData {
  backgroundSound: string | null;
  rotationSounds: string[];
  rotationTimeout: number;
  rotationSoundTimeout: number;
  backgroundVolume: number;
  rotationVolume: number;
}

