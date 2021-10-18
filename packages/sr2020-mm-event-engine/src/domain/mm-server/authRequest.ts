import Ajv, { JSONSchemaType } from "ajv";

const ajv = new Ajv({
  allErrors: true,
  // removeAdditional: true,
  // useDefaults: true
});


export interface AuthRequest {
  username: string;
  password: string;
}

const authRequestSchema: JSONSchemaType<AuthRequest> = {
  type: "object",
  properties: {
    username: {type: "string"},
    password: {type: "string"},
  },
  required: ["username", "password"],
  additionalProperties: false,
};

export const validateAuthRequest = ajv.compile(authRequestSchema);
