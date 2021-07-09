import { ErrorResponse, isEmptyBodyStorage, isFullBodyStorage } from "sr2020-mm-event-engine";
import { createLogger, getQrModelData, PlayerAuthorizedRequest, validateBodyStorageQrModelData, validateSpiritJarQrModelData } from "sr2020-mm-server-event-engine";
import { decode } from "../../utils";
import { qrIdIsNanError } from "./utils";

const logger = createLogger('isBodyStorageValid.ts');

export const isBodyStorageValid = async (req1, res, next) => {
  const req = req1 as PlayerAuthorizedRequest;
  const { bodyStorageQrString, shouldBeEmpty } = req.query;
  if (typeof bodyStorageQrString !== 'string' || 
    (shouldBeEmpty !== 'true' && shouldBeEmpty !== 'false')) {
    const errorResponse: ErrorResponse = {
      errorTitle: 'Получен неправильный параметр запроса',
      errorSubtitle: `Данные QR не являются строкой или shouldBeEmpty не правильный: ${bodyStorageQrString}`
    };
    res.status(400).json(errorResponse);
    return;
  }

  const shouldBeEmpty2 = shouldBeEmpty === 'true';
  try {
    const qrData = decode(bodyStorageQrString);
    const qrId = Number(qrData.payload);

    if (Number.isNaN(qrId)) {
      res.status(400).json(qrIdIsNanError(qrData.payload));
      return;
    }

    const qrModelData = await getQrModelData(qrId);
    // const qrModelData = await getQrModelData(qrId + 1000000);

    const validationRes = validateBodyStorageQrModelData(qrModelData);

    if ('errorTitle' in validationRes) {
      res.status(500).json(validationRes);
      return;
    }

    logger.info('shouldBeEmpty2', shouldBeEmpty2);

    if (shouldBeEmpty2) {
      if (isFullBodyStorage(validationRes)) {
        const errorResponse: ErrorResponse = { 
          errorTitle: 'Телохранилище занято',
          errorSubtitle: '' 
        };
        res.status(400).json(errorResponse);
        return;
      }
    } else {
      if (isFullBodyStorage(validationRes)) {
        const characterId = validationRes.workModel.data.body.characterId;
        if (req.userData.modelId !== Number(characterId)) {
          const errorResponse: ErrorResponse = { 
            errorTitle: 'В телохранилище не ваше тело',
            errorSubtitle: '' 
          };
          res.status(400).json(errorResponse);
          return;
        }
      } else {
        const errorResponse: ErrorResponse = { 
          errorTitle: 'Телохранилище пусто',
          errorSubtitle: '' 
        };
        res.status(400).json(errorResponse);
        return;
      }
    }
    
    res.json(true);
  } catch (error) {
    const message = `${error} ${JSON.stringify(error)}`;
    logger.error(message, error);
    const errorResponse: ErrorResponse = { 
      errorTitle: 'Непредвиденная ошибка',
      errorSubtitle: message 
    };
    res.status(500).json(errorResponse);
  }
}