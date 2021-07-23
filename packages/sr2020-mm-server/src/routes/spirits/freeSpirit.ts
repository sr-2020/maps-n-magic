import { 
  EPutSpiritRequested, 
  ErrorResponse, 
  GetSpirit, 
  invalidRequestBody, 
  isEmptySpiritJar, 
  validateFreeSpiritInternalRequest 
} from "sr2020-mm-event-engine";
import { 
  createLogger, 
  freeSpiritFromStorage, 
  getQrModelData, 
  InnerApiRequest, 
  validateSpiritJarQrModelData 
} from "sr2020-mm-server-event-engine";

import { EndpointLogger, EndpointId } from './logUtils';

const logger = createLogger('freeSpirit.ts');

export const mainFreeSpirit = async (req1, res, next) => {
  const eLogger = new EndpointLogger(logger, EndpointId.FREE_SPIRIT);
  try {
    // logger.info('mainCatchSpirit')
    const req = req1 as InnerApiRequest;
    const { body } = req;

    eLogger.attempt(body);

    if (!validateFreeSpiritInternalRequest(body)) {
      const errorResponse = invalidRequestBody(body, validateFreeSpiritInternalRequest.errors);
      res.status(400).json(errorResponse);
      eLogger.fail(errorResponse);
      return;
    }

    const { qrId, reason, characterId } = body;
    eLogger.setCharacterId(characterId);

    const qrModelData1 = await getQrModelData(qrId);

    const validationRes = validateSpiritJarQrModelData(qrModelData1);

    if ('errorTitle' in validationRes) {
      res.status(500).json(validationRes);
      eLogger.fail(validationRes);
      return;
    }

    const qrModelData = validationRes;

    if (isEmptySpiritJar(qrModelData)) {
      const errorResponse: ErrorResponse = {
        errorTitle: 'Тотем пуст',
        errorSubtitle: ``
      };
      res.status(400).json(errorResponse);
      eLogger.fail(errorResponse, errorResponse.errorTitle);
      return;
    }

    const { spiritId } = qrModelData.workModel.data;

    const spirit = req.gameModel.get2<GetSpirit>({
      type: 'spirit',
      id: Number(spiritId)
    });

    if (spirit === undefined) {
      logger.warn(`Запрос на очистку QR с несуществующим духом ${JSON.stringify({
        qrId,
        spiritId
      })}`);

      const qrModelData = await freeSpiritFromStorage(Number(qrId), reason);

      const errorResponse = validateSpiritJarQrModelData(qrModelData);

      if ('errorTitle' in errorResponse) {
        res.status(500).json(errorResponse);
        eLogger.fail(errorResponse);
        return;
      }

      eLogger.success(`free non existing spirit ${spiritId}`, `Не существующий дух ${spiritId} освобождён`);

      res.status(200).json({
        status: 'success',
        qrModelData: errorResponse
      });
      return;
    }

    if (spirit.state.status === 'InJar') {
      const { qrId: qrIdFromGameModel } = spirit.state;

      if (qrId !== qrIdFromGameModel) {
        logger.warn(`QR содержит духа, который находится в другом QR. Дух не очищен ${JSON.stringify({
          qrId,
          spiritId,
          qrIdFromGameModel
        })}`);
      } else {
        req.gameModel.emit2<EPutSpiritRequested>({
          type: 'putSpiritRequested',
          id: spirit.id,
          props: {
            state: {
              status: 'RestInAstral'
            },
          }
        });
      }
    }

    const qrModelData2 = await freeSpiritFromStorage(Number(qrId), reason);

    const errorResponse = validateSpiritJarQrModelData(qrModelData2);

    if ('errorTitle' in errorResponse) {
      res.status(500).json(errorResponse);
      eLogger.fail(errorResponse);
      return;
    }

    eLogger.success(`free spirit ${spirit.id} ${spirit.name}`, `Дух ${spirit.id} ${spirit.name} освобожден`);

    res.status(200).json({
      status: 'success',
      qrModelData: errorResponse
    });

  } catch(error) {
    const message = `${error} ${JSON.stringify(error)}`;
    logger.error(message, error);
    const errorResponse: ErrorResponse = { 
      errorTitle: 'Непредвиденная ошибка',
      errorSubtitle: message 
    };
    res.status(500).json(errorResponse);
    eLogger.fail(errorResponse, errorResponse.errorTitle);
    return;
  }
}