import Ajv, { JSONSchemaType } from "ajv";
import * as R from 'ramda';
import { BodyStorageQr, ErrorResponse, GameModel, GetFeature, GetSpiritFraction, Spirit, SpiritJarQr, validateBodyStorageQr, validateCommonQr, validateSpiritJarQr } from "sr2020-mm-event-engine";
import { createLogger } from "../utils";

const logger = createLogger('server-ee/spirits.ts');

const ajv = new Ajv({
  allErrors: true,
  // removeAdditional: true,
  // useDefaults: true
});

export interface FreeSpiritRequestBody {
  qrId: number;
  reason: string;
}

const freeSpiritRequestBodySchema: JSONSchemaType<FreeSpiritRequestBody> = {
  type: "object",
  properties: {
    qrId: { type: 'integer' },
    reason: { type: 'string' },
  },
  required: ["qrId", "reason"],
};

export const validateFreeSpiritRequestBody = ajv.compile(freeSpiritRequestBodySchema);

export interface CatchSpiritRequestBody {
  qrId: number;
  spiritId: number;
}

const catchSpiritRequestBodySchema: JSONSchemaType<CatchSpiritRequestBody> = {
  type: "object",
  properties: {
    qrId: { type: 'integer' },
    spiritId: { type: 'integer' },
  },
  required: ["qrId", "spiritId"],
};

export const validateCatchSpiritRequestBody = ajv.compile(catchSpiritRequestBodySchema);

export interface CatchSpirit2RequestBody {
  spiritJarQrString: string;
  spiritId: number;
}

const catchSpirit2RequestBodySchema: JSONSchemaType<CatchSpirit2RequestBody> = {
  type: "object",
  properties: {
    spiritJarQrString: { type: 'string' },
    spiritId: { type: 'integer' },
  },
  required: ["spiritJarQrString", "spiritId"],
};

export const validateCatchSpirit2RequestBody = ajv.compile(catchSpirit2RequestBodySchema);

export interface SuitSpiritRequestBody {
  bodyStorageQrString: string;
  spiritJarQrString: string;
}

const suitSpiritRequestBodySchema: JSONSchemaType<SuitSpiritRequestBody> = {
  type: "object",
  properties: {
    spiritJarQrString: { type: 'string' },
    bodyStorageQrString: { type: 'string' },
  },
  required: ["spiritJarQrString", "bodyStorageQrString"],
};

export const validateSuitSpiritRequestBody = ajv.compile(suitSpiritRequestBodySchema);

export interface DispiritRequestBody {
  bodyStorageQrString: string;
  spiritJarQrString: string | null;
  messageBody: string;
}

const dispiritRequestBodySchema: JSONSchemaType<DispiritRequestBody> = {
  type: "object",
  properties: {
    bodyStorageQrString: { type: 'string' },
    spiritJarQrString: { type: 'string', nullable: true },
    messageBody: { type: 'string' },
  },
  required: ["bodyStorageQrString", "spiritJarQrString", "messageBody"],
};

export const validateDispiritRequestBody = ajv.compile(dispiritRequestBodySchema);

export function validateSpiritJarQrModelData(qrModelData: unknown): 
  SpiritJarQr | ErrorResponse
{
  if (!validateCommonQr(qrModelData)) {
    const message = `Данные QR не корректны. Данные модели ${JSON.stringify(qrModelData)}, ошибки валидации ${JSON.stringify(validateCommonQr.errors)}`;
    logger.error(message, validateCommonQr.errors);
    const errorResponse: ErrorResponse = {
      errorTitle: 'Получен некорректный ответ от менеджера моделей',
      errorSubtitle: message 
    };
    return errorResponse;
  }

  if (!validateSpiritJarQr(qrModelData)) {
    let errorTitle = '';
    let errorSubtitle = '';
    if (qrModelData.workModel.type === 'spirit_jar') {
      errorTitle = 'Духохранилище некорректно';
      errorSubtitle = `Данные модели ${JSON.stringify(qrModelData)}, ошибки валидации ${JSON.stringify(validateSpiritJarQr.errors)}`;
    } else {
      errorTitle = 'QR не является духохранилищем';
      errorSubtitle = `Тип QR: ${qrModelData.workModel.type}`;
    }

    // const message = `. qrModelData ${JSON.stringify(qrModelData)}, validation errors ${JSON.stringify(validateSpiritJarQr.errors)}`;
    logger.error(errorSubtitle, validateSpiritJarQr.errors);
    const errorResponse: ErrorResponse = {
      errorTitle,
      errorSubtitle
    };
    return errorResponse;
  }
  return qrModelData;
}

export function validateBodyStorageQrModelData(qrModelData: unknown): 
  BodyStorageQr | ErrorResponse
{
  if (!validateCommonQr(qrModelData)) {
    const message = `Данные QR не корректны. Данные модели ${JSON.stringify(qrModelData)}, ошибки валидации ${JSON.stringify(validateCommonQr.errors)}`;
    logger.error(message, validateCommonQr.errors);
    const errorResponse: ErrorResponse = {
      errorTitle: 'Получен некорректный ответ от менеджера моделей',
      errorSubtitle: message 
    };
    return errorResponse;
  }

  if (!validateBodyStorageQr(qrModelData)) {
    let errorTitle = '';
    let errorSubtitle = '';
    if (qrModelData.workModel.type === 'body_storage') {
      errorTitle = 'Телохраниилище некорректно';
      errorSubtitle = `Данные модели ${JSON.stringify(qrModelData)}, ошибки валидации ${JSON.stringify(validateSpiritJarQr.errors)}`;
    } else {
      errorTitle = 'QR не является телохранилищем';
      errorSubtitle = `Тип QR: ${qrModelData.workModel.type}`;
    }

    logger.error(errorSubtitle, validateBodyStorageQr.errors);
    const errorResponse: ErrorResponse = {
      errorTitle,
      errorSubtitle
    };
    return errorResponse;
  }
  return qrModelData;
}


export function getSpiritWithFractionAbilities(gameModel: GameModel, spirit: Spirit): Spirit {
  const clone = {...spirit};
  const spiritFraction = gameModel.get2<GetSpiritFraction>({
    type: 'spiritFraction',
    id: spirit.fraction
  });
  if (spiritFraction !== undefined) {
    const abilities = R.uniq([...spirit.abilities, ...spiritFraction.abilities]);
    abilities.sort();
    clone.abilities = abilities;
  }
  return clone;
}

export function translateAbilities(gameModel: GameModel, abilities: string[]): string[] {
  const translatedAbilities = abilities.map(abilityId => {
    const ability = gameModel.get2<GetFeature>({
      type: 'feature',
      id: abilityId
    });
    // logger.info('abilityId', abilityId, 'ability', ability);
    return ability?.humanReadableName || abilityId;
  });
  translatedAbilities.sort();
  return translatedAbilities;
}