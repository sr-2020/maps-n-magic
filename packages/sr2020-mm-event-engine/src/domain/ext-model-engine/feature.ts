// In original code abilities named Features
// https://github.com/sr-2020/nodejs-monorepo/blob/d4d815dd4e454dcd4919e70860488b3c5998451e/packages/sr2020-common/models/sr2020-character.model.ts#L136

import Ajv, { JSONSchemaType } from "ajv";

const ajv = new Ajv({
  allErrors: true,
});

export interface PackInfo {
  id: string;
  level: number;
}

export type FeatureAvailability = 'open' | 'closed' | 'master';

export interface Feature {
  id: string;
  humanReadableName: string;
  description: string;
  karmaCost: number;
  prerequisites: string[];
  availability: FeatureAvailability;
  pack?: PackInfo;
}

export const featureSchema: JSONSchemaType<Feature> = {
  type: 'object',
  required: ['id', 'humanReadableName', 'description', 'karmaCost', 'prerequisites', 'availability'],
  properties: {
    id: { type: 'string' },
    humanReadableName: { type: 'string' },
    description: { type: 'string' },
    karmaCost: { type: 'number' },
    prerequisites: { type: 'array', items: { type: 'string' } },
    availability: { type: 'string', enum: ['open', 'master', 'closed'] },
    pack: {
      type: 'object',
      required: ['id', 'level'],
      properties: {
        id: { type: 'string' },
        level: { type: 'number' },
      },
      nullable: true
    },
  },
};

export const featureArrSchema: JSONSchemaType<Feature[]> = {
  type: 'array',
  items: featureSchema
};

export const validateFeatureArr = ajv.compile(featureArrSchema);
export const validateFeature = ajv.compile(featureSchema);