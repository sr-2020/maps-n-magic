import Ajv, { JSONSchemaType } from "ajv";

export interface TokenRequestBody {
  api_key: string;
  id?: number;
}

const ajv = new Ajv({
  allErrors: true,
  // removeAdditional: true,
  // useDefaults: true
});

const tokenRequestBodySchema: JSONSchemaType<TokenRequestBody> = {
  type: "object",
  properties: {
    id: {type: "integer", nullable: true},
    api_key: {type: "string"},
  },
  required: ["api_key"],
  additionalProperties: false,
};

export const validateTokenRequestBody = ajv.compile(tokenRequestBodySchema);