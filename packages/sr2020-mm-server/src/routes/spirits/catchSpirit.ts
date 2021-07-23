import * as R from 'ramda';
import { 
  EPutSpiritRequested, 
  ErrorResponse, 
  GetSpirit, 
  getSpiritLocationId, 
  GetUserRecord, 
  invalidRequestBody, 
  isFullSpiritJar, 
  validateCatchSpiritInternalRequest 
} from 'sr2020-mm-event-engine';
import { 
  createLogger, 
  DecrementAttempt, 
  GetCatcherState, 
  getQrModelData, 
  InnerApiRequest, 
  putSpiritInStorage, 
  EndpointId, 
  EndpointLogger, 
  validateSpiritJarQrModelData 
} from 'sr2020-mm-server-event-engine';

const logger = createLogger('catchSpirit.ts');

export const mainCatchSpirit = async (req1, res, next) => {
  const eLogger = new EndpointLogger(logger, EndpointId.CATCH_SPIRIT);
  try {
    // logger.info('mainCatchSpirit')
    const req = req1 as InnerApiRequest;
    const { body } = req;

    eLogger.attempt(body);

    if (!validateCatchSpiritInternalRequest(body)) {
      const errorResponse = invalidRequestBody(body, validateCatchSpiritInternalRequest.errors);
      res.status(400).json(errorResponse);
      eLogger.fail(errorResponse);
      return;
    }

    const { characterId, qrId, spiritId } = body;
    eLogger.setCharacterId(characterId);

    const catcherState = req.gameModel.get2<GetCatcherState>({
      type: 'catcherState',
      id: String(characterId)
    });

    if (catcherState === undefined) {
      const errorResponse: ErrorResponse = {
        errorTitle: 'Спелл spirit catcher не активен',
        errorSubtitle: `Спелл spirit catcher для персонажа ${characterId} не активен`
      };
      res.status(400).json(errorResponse);
      eLogger.fail(errorResponse, errorResponse.errorTitle);
      return;
    }

    // First set of checks
    //   user with characterId exists
    //   qr with qrId is spirit jar
    //   spirit with spiritId checks

    // 1. Lets take spirit
    const spirit = req.gameModel.get2<GetSpirit>({
      type: 'spirit',
      id: Number(spiritId)
    });

    if (spirit === undefined) {
      const errorResponse: ErrorResponse = {
        errorTitle: 'Дух не найден',
        errorSubtitle: `Дух с id ${spiritId} не найден`
      };
      res.status(400).json(errorResponse);
      eLogger.fail(errorResponse, errorResponse.errorTitle);
      return;
    }

    // 2. get qr model and check if it is SpiritJar
    const qrModelData1 = await getQrModelData(qrId);

    const validationRes = validateSpiritJarQrModelData(qrModelData1);

    if ('errorTitle' in validationRes) {
      res.status(500).json(validationRes);
      eLogger.fail(validationRes);
      return;
    }

    const qrModelData = validationRes;

    // 3. take character position
    const userRecord = req.gameModel.get2<GetUserRecord>({
      type: 'userRecord',
      id: Number(characterId)
    });

    if (userRecord === undefined) {
      const errorResponse: ErrorResponse = {
        errorTitle: 'Персонаж не найден',
        errorSubtitle: `Персонаж с id ${characterId} не найден`
      };
      res.status(400).json(errorResponse);
      eLogger.fail(errorResponse, errorResponse.errorTitle);
      return;
    }

    // here we know 
    //   spirit exists
    //   qr model is spirit jar
    //   userRecord exists

    // Second set of checks
    //   user and spirit are in the same location so user can really catch spirit
    //   spirit jar is empty

    const { location_id: userLocationId } = userRecord;
    if (userLocationId == null) {
      const errorResponse: ErrorResponse = {
        errorTitle: 'Локация мага неизвестна',
        errorSubtitle: `Маг с id ${userRecord.id} в неизвестной локации`
      };
      res.status(400).json(errorResponse);
      eLogger.fail(errorResponse, errorResponse.errorTitle);
      return;
    }

    const spiritLocationId = getSpiritLocationId(spirit);

    if (spiritLocationId == undefined) {
      const errorResponse: ErrorResponse = {
        errorTitle: 'Локация духа неизвестна',
        errorSubtitle: `Дух с id ${spiritId} в неизвестной локации`
      };
      res.status(400).json(errorResponse);
      eLogger.fail(errorResponse, errorResponse.errorTitle);
      return;
    }

    // if (userLocationId !== spiritLocationId) {
    //   logger.warn(`Пользователь пытается поймать духа не из своей локации. Данные ${JSON.stringify({
    //     characterId,
    //     qrId, 
    //     spiritId,
    //     spiritName: spirit.name,
    //     userLocationId,
    //     spiritLocationId
    //   })}`);
    //   const resBody = {
    //     status: 'fail',
    //     message: 'Попытка не удалась'
    //   };
    //   eLogger.fail(errorResponse);
    //   res.status(400).json(resBody);
    //   return;
    // }

    if (isFullSpiritJar(qrModelData)) {
      const errorResponse: ErrorResponse = {
        errorTitle: 'Тотем содержит духа',
        errorSubtitle: `В тотеме уже находится дух`
      };
      res.status(400).json(errorResponse);
      eLogger.fail(errorResponse, errorResponse.errorTitle);
      return;
    }

    // action
    //   put spirit id in QR
    //   put new spirit state: InJar + qr id

    req.gameModel.execute2<DecrementAttempt>({
      type: 'decrementAttempt',
      characterId: characterId
    });

    const { catchProbability } = catcherState;

    const testValue = Math.random() * 100;

    if (testValue > catchProbability) {
      const errorResponse: ErrorResponse = {
        errorTitle: 'Поймать духа не удалось',
        errorSubtitle: `Вероятность поимки ${catchProbability}%, выпавшее значение ${testValue.toFixed(1)}`
      };
      res.status(400).json(errorResponse);
      eLogger.fail(errorResponse, errorResponse.errorSubtitle);
      return;
    }

    const putResult = await putSpiritInStorage(qrId, spiritId);
    // logger.info('put spirit success confirmation', putResult);

    req.gameModel.emit2<EPutSpiritRequested>({
      type: 'putSpiritRequested',
      id: spiritId,
      props: {
        state: {
          status: 'InJar',
          qrId
        },
      }
    });

    eLogger.success(
      `catch spirit ${spirit.id} ${spirit.name} in qr ${qrId}`, 
      `Дух ${spirit.id} ${spirit.name} пойман в тотем ${qrId}`
    );

    // res.status(200).json(body);
    res.status(200).json({
      status: 'success',
      message: 'Дух пойман'
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
