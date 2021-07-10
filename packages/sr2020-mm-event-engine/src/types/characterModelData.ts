import Ajv, { JSONSchemaType } from "ajv";

const ajv = new Ajv({
  allErrors: true,
  // removeAdditional: true,
  // useDefaults: true
});

// based on 
// https://github.com/sr-2020/nodejs-monorepo/blob/7d4c387bdc31ce0d6f4baf2d9bb2ee1c81258a73/packages/sr2020-common/models/sr2020-character.model.ts
export type BodyType = 'physical' | 'astral' | 'drone' | 'ectoplasm' | 'vr';

export type HealthState = 'healthy' | 'wounded' | 'clinically_dead' | 'biologically_dead';

export interface Sr2020Character {
  modelId: string;
  currentBody: BodyType;
  healthState: HealthState;
}

export interface CharacterModelData {
  workModel: Sr2020Character;
}

export interface CharacterModelData2 extends CharacterModelData {
  isInSpiritSuit: boolean;
}

const bodyTypeSchema: JSONSchemaType<BodyType> = {
  oneOf: [
    { type: 'string', const: 'physical' },
    { type: 'string', const: 'astral' },
    { type: 'string', const: 'drone' },
    { type: 'string', const: 'ectoplasm' },
    { type: 'string', const: 'vr' },
  ]
};

export const validateBodyType = ajv.compile(bodyTypeSchema);

const healthStateSchema: JSONSchemaType<HealthState> = {
  oneOf: [
    { type: 'string', const: 'healthy' },
    { type: 'string', const: 'wounded' },
    { type: 'string', const: 'clinically_dead' },
    { type: 'string', const: 'biologically_dead' },
  ]
};

export const validateHealthState = ajv.compile(healthStateSchema);

const sr2020CharacterSchema: JSONSchemaType<Sr2020Character> = {
  type: 'object',
  properties: {
    'modelId': { type: 'string' },
    'currentBody': bodyTypeSchema,
    'healthState': healthStateSchema
  },
  required: ['currentBody', 'healthState', 'modelId']
};

export const validateSr2020Character = ajv.compile(sr2020CharacterSchema);


const characterModelDataSchema: JSONSchemaType<CharacterModelData> = {
  type: 'object',
  properties: {
    workModel: sr2020CharacterSchema
  },
  required: ['workModel']
};

export const validateCharacterModelData = ajv.compile(characterModelDataSchema);