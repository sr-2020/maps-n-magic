import Ajv, { JSONSchemaType } from "ajv";
import { MessageData } from ".";
import { CatcherData } from "./spiritCatcher";
import { SuitedState } from "./spirits";

const ajv = new Ajv({
  allErrors: true,
  // removeAdditional: true,
  // useDefaults: true
});

// based on 
// https://github.com/sr-2020/nodejs-monorepo/blob/7d4c387bdc31ce0d6f4baf2d9bb2ee1c81258a73/packages/sr2020-common/models/sr2020-character.model.ts
export type BodyType = 'physical' | 'astral' | 'drone' | 'ectoplasm' | 'vr';

export type MetaRace =
  | 'meta-norm'
  | 'meta-elf'
  | 'meta-dwarf'
  | 'meta-ork'
  | 'meta-troll'
  | 'meta-vampire'
  | 'meta-ghoul'
  | 'meta-digital'
  | 'meta-spirit'
;

export type HealthState = 'healthy' | 'wounded' | 'clinically_dead' | 'biologically_dead';

interface AddedPassiveAbility {
  // Unique string identifier. Should be unique not only among all AddedPassiveAbility, but also among
  // other features: active abilities, spells, etc.
  id: string;

  // Short-ish human-readable name to be shown in the UI.
  // humanReadableName: string;

  // Full description. Can be multiline.
  // description: string;

  // Unix timestamp in milliseconds. Set only if ability is temporary
  // (e.g. was added by effect of some other ability or spell)
  // validUntil?: number;

  // List of modifiers added by this passive ability. Used to remove them when feature is being removed.
  // Can be omitted if this passive abiliy doesn't have any modifiers (i.e. it's only effect is to
  // show some text to the user).
  // modifierIds?: string[];
}

export interface Sr2020Character {
  modelId: string;
  name: string;
  currentBody: BodyType;
  healthState: HealthState;
  metarace: MetaRace;
  passiveAbilities: AddedPassiveAbility[];
  // I use only id so I don't care about passive or active abilities or spells here
  activeAbilities: AddedPassiveAbility[];
  spells: AddedPassiveAbility[];
}

export interface CharacterModelData {
  workModel: Sr2020Character;
}

export interface CharacterModelData2 extends CharacterModelData {
  spiritSuitState: SuitedState | undefined;
  catcherData: CatcherData | undefined;
  messageData?: MessageData;
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

const addedPassiveAbilitySchema: JSONSchemaType<AddedPassiveAbility> = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string' }
  }
};

export const validateAddedPassiveAbility = ajv.compile(addedPassiveAbilitySchema);


const metaRaceSchema: JSONSchemaType<MetaRace> = {
  oneOf: [
    { type: 'string', const: 'meta-norm' },
    { type: 'string', const: 'meta-elf' },
    { type: 'string', const: 'meta-dwarf' },
    { type: 'string', const: 'meta-ork' },
    { type: 'string', const: 'meta-troll' },
    { type: 'string', const: 'meta-vampire' },
    { type: 'string', const: 'meta-ghoul' },
    { type: 'string', const: 'meta-digital' },
    { type: 'string', const: 'meta-spirit' },
  ]
};

export const validateMetaRace = ajv.compile(metaRaceSchema);

const sr2020CharacterSchema: JSONSchemaType<Sr2020Character> = {
  type: 'object',
  properties: {
    'modelId': { type: 'string' },
    'name': { type: 'string' },
    'currentBody': bodyTypeSchema,
    'healthState': healthStateSchema,
    'metarace': metaRaceSchema,
    'passiveAbilities': {
      type: 'array',
      items: addedPassiveAbilitySchema
    },
    'activeAbilities': {
      type: 'array',
      items: addedPassiveAbilitySchema
    },
    'spells': {
      type: 'array',
      items: addedPassiveAbilitySchema
    },
  },
  required: [
    'currentBody', 
    'healthState', 
    'modelId', 
    'name', 
    'metarace', 
    'activeAbilities', 
    'passiveAbilities',
    'spells',
  ]
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