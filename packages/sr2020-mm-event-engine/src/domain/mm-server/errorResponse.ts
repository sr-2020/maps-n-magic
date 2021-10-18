import Ajv, { JSONSchemaType } from "ajv";

const ajv = new Ajv({
  allErrors: true,
});

export interface ErrorResponse {
  errorTitle: string;
  errorSubtitle: string;
}

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