import * as R from 'ramda';
import { BodyStorageQr, ErrorResponse, GameModel, GetFeature, GetSpiritFraction, Spirit, SpiritJarQr, validateBodyStorageQr, validateCommonQr, validateSpiritJarQr } from "sr2020-mm-event-engine";
import { createLogger } from "../utils";

const logger = createLogger('server-ee/spirits.ts');

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