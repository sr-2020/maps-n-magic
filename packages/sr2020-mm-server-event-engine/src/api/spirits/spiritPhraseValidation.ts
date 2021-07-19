import Ajv, { JSONSchemaType } from "ajv";

import { 
  SpiritPhrase,
} from 'sr2020-mm-event-engine';

const ajv = new Ajv({
  allErrors: true,
  removeAdditional: true,
  // useDefaults: true
});

const defaultSpiritPhrase: Omit<SpiritPhrase, "id"> = {
  endDate: 0,
  startDate: 0,
  message: '',
};

const spiritPhraseSchema: JSONSchemaType<SpiritPhrase> = {
  type: "object",
  properties: {
    id: {type: "integer"},
    startDate: {type: "integer"},
    endDate: {type: "integer"},
    message: {type: "string"},
  },
  required: ["id", "startDate", "endDate", "message"],
  additionalProperties: false,
}

export const validateSpiritPhrase = ajv.compile(spiritPhraseSchema);

const newSpiritPhraseSchema: JSONSchemaType<Omit<SpiritPhrase, "id">> = {
  type: "object",
  properties: {
    startDate: {type: "integer"},
    endDate: {type: "integer"},
    message: {type: "string"},
  },
  required: ["startDate", "endDate", "message"],
  additionalProperties: false,
}

export const validateNewSpiritPhrase = ajv.compile(newSpiritPhraseSchema);

export function fillNewSpiritPhrase(spiritPhrase: Partial<Omit<SpiritPhrase, "id">>): Omit<SpiritPhrase, "id"> {
  return {
    ...defaultSpiritPhrase,
    ...spiritPhrase
  };
}