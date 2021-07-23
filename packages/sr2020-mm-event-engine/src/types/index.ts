import L from 'leaflet';
import Ajv, { JSONSchemaType } from "ajv";

import * as ManaOcean from "./manaOcean";
import { SRLatLng, LocationRecord } from "./locations";
export * from "./enums";
export * from "./manaOcean";
export * from "./features";
export * from "./spirits";
export * from "./misc";
export * from "./beacons";
export * from "./locations";
export * from "./characterServer";
export * from "./qr";
export * from "./qrType";
export * from "./tokenData";
export * from "./characterModelData";
export * from "./abilityUtils";
export * from "./spiritCatcher";

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
  locationId: number | null;
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


export interface RawSpellCast {
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

export interface SpellCast extends RawSpellCast {
  uid: string;
}

// export type RectLatLngs = L.LatLng[][] | L.LatLng[] | L.LatLng[][][];
// export type RectLatLngs = L.LatLng[][];

export interface BackgroundImage {
  latlngs: L.LatLngLiteral[][];
  image: string;
  id: number;
  name: string;
}

export interface SoundSettings {
  rotationTimeout: number;
  rotationSoundTimeout: number;
  backgroundVolume: number;
  rotationVolume: number;
}

export interface TrackData {
  key: string | number;
  name: string;
  volumePercent: number; // 0-100
}

export interface Rotation {
  key: string | number;
  tracks: TrackData[],
}

export interface SoundStageState {
  backgroundSound: TrackData | null;
  rotationSounds: Rotation | null;
}

export interface SoundStageData extends SoundSettings, SoundStageState {
}

const ajv = new Ajv({
  allErrors: true,
});

export interface ErrorResponse {
  errorTitle: string;
  errorSubtitle: string;
}

// error: string;
const errorResponseSchema: JSONSchemaType<ErrorResponse> = {
  type: "object",
  properties: {
    errorTitle: {
      type: "string",
    },
    errorSubtitle: {
      type: "string",
    },
  },
  required: ["errorTitle", "errorSubtitle"],
};

export const validateErrorResponse = ajv.compile(errorResponseSchema);

export function isErrorResponse(data: any): data is ErrorResponse {
  return data != null && typeof data === 'object' && typeof data.errorTitle === 'string';
}

export function invalidRequestBody(body: any, errors: any): ErrorResponse {
  return {
    errorTitle: 'Получены неправильные параметры запроса',
    errorSubtitle: `Тело запроса: ${JSON.stringify(body)}, ошибки валидации ${JSON.stringify(errors)}`
  };
}

export interface SuitSpiritInternalRequest {
  characterId: number;
  spiritJarId: number;
  bodyStorageId: number;
  suitDuration: number;
}

const suitSpiritInternalRequestSchema: JSONSchemaType<SuitSpiritInternalRequest> = {
  type: "object",
  properties: {
    characterId: { type: 'number' },
    spiritJarId: { type: 'number' },
    bodyStorageId: { type: 'number' },
    suitDuration: { type: 'number' },
  },
  required: ["characterId", "spiritJarId", "bodyStorageId", "suitDuration"],
};

export const validateSuitSpiritInternalRequest = ajv.compile(suitSpiritInternalRequestSchema);

export interface DispiritInternalRequest {
  characterId: number;
  spiritJarId: number | null;
  bodyStorageId: number;
  messageBody: string;
}

const dispiritInternalRequestSchema: JSONSchemaType<DispiritInternalRequest> = {
  type: "object",
  properties: {
    characterId: { type: 'number' },
    spiritJarId: { type: 'number', nullable: true },
    bodyStorageId: { type: 'number' },
    messageBody: { type: 'string' },
  },
  required: ["characterId", "spiritJarId", "bodyStorageId", "messageBody"],
};

export const validateDispiritInternalRequest = ajv.compile(dispiritInternalRequestSchema);


export interface CatchSpiritInternalRequest {
  qrId: number;
  spiritId: number;
  characterId: number;
}

const catchSpiritInternalRequestSchema: JSONSchemaType<CatchSpiritInternalRequest> = {
  type: "object",
  properties: {
    qrId: {
      type: "number",
    },
    spiritId: {
      type: "number",
    },
    characterId: {
      type: "number",
    },
  },
  required: ["qrId", "spiritId", "characterId"],
  additionalProperties: false
};

export const validateCatchSpiritInternalRequest = ajv.compile(catchSpiritInternalRequestSchema);

export interface FreeSpiritInternalRequest {
  qrId: number;
  reason: string;
  characterId: number;
}

const freeSpiritInternalRequestSchema: JSONSchemaType<FreeSpiritInternalRequest> = {
  type: "object",
  properties: {
    qrId: {
      type: "number",
    },
    reason: {
      type: "string",
    },
    characterId: {
      type: "number",
    },
  },
  required: ["qrId", "reason", "characterId"],
  additionalProperties: false
};

export const validateFreeSpiritInternalRequest = ajv.compile(freeSpiritInternalRequestSchema);



export interface PutSpiritInJarRequestBody {
  spiritType: "mr-cellophane" | "fireball-keeper" | "tick-a-lick-a-boo";
  qrId: number; // qrId пустого духохранилища
}

const putSpiritInJarRequestBodySchema: JSONSchemaType<PutSpiritInJarRequestBody> = {
  type: "object",
  properties: {
    qrId: {
      type: "number",
    },
    spiritType: {
      type: "string",
      enum: ['fireball-keeper', 'mr-cellophane', 'tick-a-lick-a-boo']
    },
  },
  required: ["qrId", "spiritType"],
  additionalProperties: false
};

export const validatePutSpiritInJarRequestBody = ajv.compile(putSpiritInJarRequestBodySchema);
