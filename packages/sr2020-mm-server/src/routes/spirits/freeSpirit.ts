import { 
  EmptySpiritJarQr,
  EPutSpiritRequested, 
  ErrorResponse, 
  FullSpiritJarQr, 
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
  validateSpiritJarQrModelData,
  EndpointId, 
  EndpointLogger,
  PutSpiritRequestedCall,
  playerMessages, 
} from "sr2020-mm-server-event-engine";
import { waitForSpiritSuited } from "./utils";

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

    const { qrId, reason, characterId, messageBody } = body;
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

        await (req.gameModel as unknown as PutSpiritRequestedCall).putSpiritRequested({
          id: spirit.id,
          props: {
            state: {
              status: 'RestInAstral'
            },
          }
        })

        const result = await waitForSpiritSuited('freeSpirit', req.gameModel, spirit.id);
      }
    }

    const qrModelData2 = await freeSpiritFromStorage(Number(qrId), reason);

    const errorResponse = validateSpiritJarQrModelData(qrModelData2);

    if ('errorTitle' in errorResponse) {
      res.status(500).json(errorResponse);
      eLogger.fail(errorResponse);
      return;
    }

    const qrModelData3 = await getQrModelData(qrId) as FullSpiritJarQr;

    const isJarEmpty = isEmptySpiritJar(qrModelData3);

    logger.info(`Spirit jar ${qrId} isJarEmpty ${isJarEmpty}, spiritId ${spiritId}`);

    eLogger.success(`free spirit ${spirit.id} ${spirit.name}`, `Дух ${spirit.id} ${spirit.name} освобожден`);

    if (messageBody !== '') {
      playerMessages(JSON.stringify({
        characterId,
        time: new Date(),
        messageBody,
        spiritId: spirit.id,
        spiritFractionId: spirit.fraction
      }));

      eLogger.success(
        `spirit ${spirit.id} ${spirit.name} got message "${messageBody}"`, 
        `Дух ${spirit.id} ${spirit.name} получил мысль "${messageBody}"`
      );
    }

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