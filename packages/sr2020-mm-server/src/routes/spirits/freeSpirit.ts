import { EPutSpiritRequested, ErrorResponse, GetSpirit, invalidRequestBody, isEmptySpiritJar, validateFreeSpiritInternalRequest } from "sr2020-mm-event-engine";
import { createLogger, freeSpiritFromStorage, getQrModelData, InnerApiRequest, validateQrModelData } from "sr2020-mm-server-event-engine";

const logger = createLogger('freeSpirit.ts');

export const mainFreeSpirit = async (req1, res, next) => {
  try {
    logger.info('mainCatchSpirit')
    const req = req1 as InnerApiRequest;
    const { body } = req;

    if (!validateFreeSpiritInternalRequest(body)) {
      res.status(400).json(invalidRequestBody(body, validateFreeSpiritInternalRequest.errors));
      return;
    }

    const { qrId, reason } = body;

    const qrModelData1 = await getQrModelData(qrId);

    const validationRes = validateQrModelData(qrModelData1);

    if ('errorTitle' in validationRes) {
      res.status(500).json(validationRes);
      return;
    }

    const qrModelData = validationRes;

    if (isEmptySpiritJar(qrModelData)) {
      const errorResponse: ErrorResponse = {
        errorTitle: 'Тотем пуст',
        errorSubtitle: ``
      };
      res.status(400).json(errorResponse);
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

      const errorResponse = validateQrModelData(qrModelData);

      if (errorResponse !== null) {
        res.status(500).json(errorResponse);
        return;
      }

      res.status(200).json({
        status: 'success',
        qrModelData
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

    const errorResponse = validateQrModelData(qrModelData2);

    if (errorResponse !== null) {
      res.status(500).json(errorResponse);
      return;
    }

    res.status(200).json({
      status: 'success',
      qrModelData
    });

  } catch(error) {
    const message = `${error} ${JSON.stringify(error)}`;
    logger.error(message, error);
    const errorResponse: ErrorResponse = { 
      errorTitle: 'Непредвиденная ошибка',
      errorSubtitle: message 
    };
    res.status(500).json(errorResponse);
    return;
  }
}