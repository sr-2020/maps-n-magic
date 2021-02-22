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
  lat: number;
  // lng: null
  lng: number;
  // location_id: null
  location_id: number;
  // ssid: "DF:8C:6D:50:E0:16"
  ssid: number;
}

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
  options: {
    color: string;
    weight: number;
    fillOpacity: number;
    manaLevel: number;
    effectList: unknown[];
  }
  polygon: SRPolygon;
  // polygon: {,…}
  // 0: [{lat: 54.929353280120615, lng: 36.87302201994499}, {lat: 54.9291853949252, lng: 36.873314380727614},…]
}

export type LocPolygonData = Pick<LocationRecord, "id" | "polygon"> & {
  centroid?: SRLatLng
};

// EdgeId format `${locId1}_${locId2}` 
// where locIds are numbers.
export type EdgeId = string;

export interface TriangulationData {
  neighborsIndex: Map<number, number[]>;
  centroids: {
    locationId: number;
    centroidLatLng: SRLatLng;
  }[];
  edgeSet: Set<EdgeId>;
}

export interface SRLatLngBounds {
  contains: (pt: SRLatLng) => boolean;
  getNorthWest: () => SRLatLng;
  getSouthEast: () => SRLatLng;
  extend: (SRLatLng) => void;
  intersects: (SRLatLngBounds) => boolean;
}

export interface RawCharacterHealthState {
  //   55817: {locationId: 3215, locationLabel: "Межрайонье 1", healthState: "clinically_dead",…}
  // healthState: "clinically_dead"
  // TODO add enum here
  healthState: string;
  // lifeStyle: "Страховка отсутствует"
  // locationId: 3215
  locationId: number;
  // locationLabel: "Межрайонье 1"
  // personName: "Blaze ноябрь"
  // timestamp: 1613673901135
  timestamp: number;
}

export interface SettingsData {

}

export interface ManaOceanSettingsData extends SettingsData {
  minManaLevel: number;
  neutralManaLevel: number;
  maxManaLevel: number;
  visibleMoonPeriod: number;
  visibleMoonNewMoonTime: number;
  visibleMoonManaTideHeight: number;
  invisibleMoonPeriod: number;
  invisibleMoonNewMoonTime: number;
  invisibleMoonManaTideHeight: number;
  // moscowTime: number;
};

export interface ManaOceanEffectSettingsData extends SettingsData {
  massacreDelay: number;
  massacreDuration: number;
  powerSpellBoundary: number;
  powerSpellDelay: number;
  powerSpellDuration: number;
  ritualMembersBoundary: number;
  ritualDelay: number;
  spellDurationItem: number;
  spellProbabilityPerPower: number;
  spellDurationPerPower: number;
}

export interface MoonProps {
  period: number;
  offset: number;
}

export interface TidePeriodProps {
  startTime: number;
  value: number;
  intervalDuration?: number;
};

export interface SettingsCatalog {
  manaOcean?: ManaOceanSettingsData;
  manaOceanEffects?: ManaOceanEffectSettingsData
};



export type SettingsKeys = keyof SettingsCatalog;

export type SettingsValues = ManaOceanSettingsData | ManaOceanEffectSettingsData;


export interface RawCharacterHealthState {
  //   55817: {locationId: 3215, locationLabel: "Межрайонье 1", healthState: "clinically_dead",…}
  // healthState: "clinically_dead"
  healthState: string;
  // lifeStyle: "Страховка отсутствует"
  lifeStyle: string;
  // locationId: 3215
  locationId: number;
  // locationLabel: "Межрайонье 1"
  // personName: "Blaze ноябрь"
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