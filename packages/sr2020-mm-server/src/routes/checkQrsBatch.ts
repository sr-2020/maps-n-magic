import * as R from 'ramda';
import { 
  ErrorResponse, 
  validateBodyStorageQr, 
  validateCommonQr, 
  validateSpiritJarQr, 
} from "sr2020-mm-event-engine";
import { 
  createLogger, 
  GetQrModelData, 
  MainAuthorizedRequest, 
} from "sr2020-mm-server-event-engine";
import { analyzeSpiritJarQr, analyzeBodyStorageQr } from "./checkQrById";

import { spiritJarList, bodyStorageList } from "./data";

const logger = createLogger('main/checkQrsBatch.ts');

export const mainCheckSpiritJarsBatch = async (req1, res, next) => {
  const req = req1 as MainAuthorizedRequest;

  const { gameModel } = req;

  try {
    const promises = spiritJarList.map((qrId) => gameModel.get2<GetQrModelData>({
      type: 'qrModelData',
      qrId
    }).then(qrModelData1 => {
      if (!validateCommonQr(qrModelData1)) {
        const message = `Данные QR не корректны. Данные модели ${JSON.stringify(qrModelData1)}, ошибки валидации ${JSON.stringify(validateCommonQr.errors)}`;
        return {
          type: 'error',
          message
        }
      }

      if (!validateSpiritJarQr(qrModelData1)) {
        return {
          type: 'error',
          message: `Qr это не spirit jar. Данные модели ${JSON.stringify(qrModelData1)}, ошибки валидации ${JSON.stringify(validateSpiritJarQr.errors)}`
        }
      }
      return analyzeSpiritJarQr(qrId, qrModelData1, gameModel);
    }));

    const processingData = await Promise.all(promises);

    const sorted = R.sortBy((el) => 'qrId' in el ? -el.qrId : -10000000 , processingData);
    const sorted2 = R.sortBy((el) => el.type , sorted);
    sorted2.reverse();

    res.status(200).json(sorted2);
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

export const mainCheckBodyStorageBatch = async (req1, res, next) => {
  const req = req1 as MainAuthorizedRequest;

  const { gameModel } = req;

  try {
    const promises = bodyStorageList.map((qrId) => gameModel.get2<GetQrModelData>({
      type: 'qrModelData',
      qrId
    }).then(qrModelData1 => {
      if (!validateCommonQr(qrModelData1)) {
        const message = `Данные QR не корректны. Данные модели ${JSON.stringify(qrModelData1)}, ошибки валидации ${JSON.stringify(validateCommonQr.errors)}`;
        return {
          type: 'error',
          message
        }
      }

      if (!validateBodyStorageQr(qrModelData1)) {
        return {
          type: 'error',
          message: `Qr это не body storage. Данные модели ${JSON.stringify(qrModelData1)}, ошибки валидации ${JSON.stringify(validateSpiritJarQr.errors)}`
        }
      }
      return analyzeBodyStorageQr(qrId, qrModelData1, gameModel);
    }));

    const processingData = await Promise.all(promises);

    res.status(200).json(processingData);
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