import Ajv, { JSONSchemaType } from "ajv";
import { BodyConditionValues } from "../mm-emercom";

export type HealthChangeMessage = {
  characterId: number,
  stateFrom: BodyConditionValues, 
  stateTo: BodyConditionValues, 
  timestamp: number,
}

const ajv = new Ajv({
  allErrors: true,
  // removeAdditional: true,
  // useDefaults: true
});

const healthChangeMessageSchema: JSONSchemaType<HealthChangeMessage> = {
  type: "object",
  properties: {
    characterId: {type: "integer"},
    stateFrom: {type: "string", enum: [
      "healthy", "wounded", "clinically_dead", "biologically_dead"
    ]},
    stateTo: {type: "string", enum: [
      "healthy", "wounded", "clinically_dead", "biologically_dead"
    ]},
    timestamp: {type: "integer"}
  },
  required: ["characterId", "stateFrom", "stateTo", "timestamp"],
  // additionalProperties: false,
};

export const validateHealthChangeMessage = ajv.compile(healthChangeMessageSchema);
