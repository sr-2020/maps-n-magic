import L from 'leaflet';

import * as ManaOcean from "./manaOcean";
export * from "./enums";
export * from "./manaOcean";

import { LifeStylesValues } from "./enums";

export interface Identifiable {
  id: number;
}

export interface UserRecord {
  // created_at: "2020-05-03 07:58:52"
  // id: 10207
  id: number;
  // location: null
  // location_id: null
  location_id: number;
  // location_updated_at: "2020-05-03 07:58:52"
  // name: ""
  name: string;
  // updated_at: "2020-05-03 07:58:52"
};

export interface BeaconRecord {
  // bssid: "DF:8C:6D:50:E0:16"
  bssid: string;
  // id: 34
  id: number;
  // label: "Нджин"
  label: string;
  // lat: null
  lat: number | null;
  // lng: null
  lng: number | null;
  // location_id: null
  location_id: number | null;
  // ssid: "DF:8C:6D:50:E0:16"
  ssid: string;
}

export interface LatLngBeaconRecord extends BeaconRecord {
  lat: number;
  lng: number;
}

export type BeaconPropChange = 
  { prop: 'bssid', value: string } |
  { prop: 'label', value: string } |
  { prop: 'lat', value: number } |
  { prop: 'lng', value: number } |
  { prop: 'location_id', value: number | null } |
  { prop: 'ssid', value: string };

// I mix two types of points - usual coordinates and meter coordinates.
// This is two very different types of points.
// Need consider reworking this concept.
// For details see utils: deg2meters and meters2deg
export type SRLatLng = {lat: number, lng: number};

export type SRPolygon = {"0": SRLatLng[]};

export interface LocationRecord {
  // beacons: [{id: 4, ssid: "EA:93:BA:E7:99:82", bssid: "EA:93:BA:E7:99:82", location_id: 3215,…},…]
  // 0: {id: 4, ssid: "EA:93:BA:E7:99:82", bssid: "EA:93:BA:E7:99:82", location_id: 3215,…}
  // 1: {id: 16, ssid: "C1:22:25:79:BF:01", bssid: "C1:22:25:79:BF:01", location_id: 3215,…}
  // 2: {id: 12, ssid: "FE:7B:B7:53:58:CB", bssid: "FE:7B:B7:53:58:CB", location_id: 3215, label: "Рубикон",…}
  // id: 3215
  id: number;
  // label: "Межрайонье 1"
  label: string;
  // layer_id: 1
  layer_id: number;
  // options: {color: "#3388ff", weight: 3, fillOpacity: 0.2, manaLevel: 6, effectList: []}
    // color: "#3388ff"
    // effectList: []
    // fillOpacity: 0.2
    // manaLevel: 6
    // weight: 3
  options: LocationRecordOptions;
  polygon: SRPolygon;
  // polygon: {,…}
  // 0: [{lat: 54.929353280120615, lng: 36.87302201994499}, {lat: 54.9291853949252, lng: 36.873314380727614},…]
}

export interface LocationRecordOptions {
  color: string;
  weight: number;
  fillOpacity: number;
  manaLevel: number;
  effectList: ManaOcean.ManaOceanEffect[];
};

export type LocPolygonData = Pick<LocationRecord, "id" | "polygon"> & {
  centroid?: SRLatLng
};

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

export interface Spirit {
  id: number;
  name: string,
  // aura: string,
  fraction: string,
  story: string,
  abilities: string[],

  // latLng: L.LatLngLiteral,
  // plane: string,
  // hitPoints: number,
  maxHitPoints: number,
}