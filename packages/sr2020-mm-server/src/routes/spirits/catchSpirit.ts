import * as R from 'ramda';
import { EPutSpiritRequested, ErrorResponse, GetSpirit, getSpiritLocationId, GetUserRecord, invalidRequestBody, isFullSpiritJar, validateCatchSpiritInternalRequest } from 'sr2020-mm-event-engine';
import { createLogger, DecrementAttempt, GetCatcherState, getQrModelData, InnerApiRequest, mmLog, putSpiritInStorage, validateSpiritJarQrModelData } from 'sr2020-mm-server-event-engine';
import shortid from 'shortid';

const logger = createLogger('catchSpirit.ts');

export const mainCatchSpirit = async (req1, res, next) => {
  const uid = shortid.generate();
  try {
    // logger.info('mainCatchSpirit')
    const req = req1 as InnerApiRequest;
    const { body } = req;

    logger.info(`CATCH_SPIRIT_ATTEMPT ${uid} data ${JSON.stringify(body)}`);
    mmLog('CATCH_SPIRIT_ATTEMPT', `${uid} data ${JSON.stringify(body)}`);

    if (!validateCatchSpiritInternalRequest(body)) {
      const errorResponse = invalidRequestBody(body, validateCatchSpiritInternalRequest.errors);
      res.status(400).json(errorResponse);
      logger.info(`CATCH_SPIRIT_FAIL ${uid} error ${JSON.stringify(errorResponse)}`);
      mmLog('CATCH_SPIRIT_FAIL', `${uid} error ${JSON.stringify(errorResponse)}`);
      return;
    }

    const { characterId, qrId, spiritId } = body;

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
      logger.info(`CATCH_SPIRIT_FAIL ${uid} error ${JSON.stringify(errorResponse)}`);
      mmLog('CATCH_SPIRIT_FAIL', `${uid} error ${JSON.stringify(errorResponse)}`);
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
      logger.info(`CATCH_SPIRIT_FAIL ${uid} error ${JSON.stringify(errorResponse)}`);
      mmLog('CATCH_SPIRIT_FAIL', `${uid} error ${JSON.stringify(errorResponse)}`);
      return;
    }

    // 2. get qr model and check if it is SpiritJar
    const qrModelData1 = await getQrModelData(qrId);

    const validationRes = validateSpiritJarQrModelData(qrModelData1);

    if ('errorTitle' in validationRes) {
      res.status(500).json(validationRes);
      logger.info(`CATCH_SPIRIT_FAIL ${uid} error ${JSON.stringify(validationRes)}`);
      mmLog('CATCH_SPIRIT_FAIL', `${uid} error ${JSON.stringify(validationRes)}`);
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
      logger.info(`CATCH_SPIRIT_FAIL ${uid} error ${JSON.stringify(errorResponse)}`);
      mmLog('CATCH_SPIRIT_FAIL', `${uid} error ${JSON.stringify(errorResponse)}`);
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
      logger.info(`CATCH_SPIRIT_FAIL ${uid} error ${JSON.stringify(errorResponse)}`);
      mmLog('CATCH_SPIRIT_FAIL', `${uid} error ${JSON.stringify(errorResponse)}`);
      return;
    }

    const spiritLocationId = getSpiritLocationId(spirit);

    if (spiritLocationId == undefined) {
      const errorResponse: ErrorResponse = {
        errorTitle: 'Локация духа неизвестна',
        errorSubtitle: `Дух с id ${spiritId} в неизвестной локации`
      };
      res.status(400).json(errorResponse);
      logger.info(`CATCH_SPIRIT_FAIL ${uid} error ${JSON.stringify(errorResponse)}`);
      mmLog('CATCH_SPIRIT_FAIL', `${uid} error ${JSON.stringify(errorResponse)}`);
      return;
    }

    if (userLocationId !== spiritLocationId) {
      logger.warn(`Пользователь пытается поймать духа не из своей локации. Данные ${JSON.stringify({
        characterId,
        qrId, 
        spiritId,
        spiritName: spirit.name,
        userLocationId,
        spiritLocationId
      })}`);
      const resBody = {
        status: 'fail',
        message: 'Попытка не удалась'
      };
      logger.info(`CATCH_SPIRIT_FAIL ${uid} error ${JSON.stringify(resBody)}`);
      mmLog('CATCH_SPIRIT_FAIL', `${uid} error ${JSON.stringify(resBody)}`);
      res.status(400).json(resBody);
      return;
    }

    if (isFullSpiritJar(qrModelData)) {
      const errorResponse: ErrorResponse = {
        errorTitle: 'Тотем содержит духа',
        errorSubtitle: `В тотеме уже находится дух`
      };
      res.status(400).json(errorResponse);
      logger.info(`CATCH_SPIRIT_FAIL ${uid} error ${JSON.stringify(errorResponse)}`);
      mmLog('CATCH_SPIRIT_FAIL', `${uid} error ${JSON.stringify(errorResponse)}`);
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
        errorTitle: 'Попытка поймать духа не удалась',
        errorSubtitle: `Вероятность поимки ${catchProbability}%, выпавшее значение ${testValue.toFixed(1)}`
      };
      res.status(400).json(errorResponse);
      logger.info(`CATCH_SPIRIT_FAIL ${uid} error ${JSON.stringify(errorResponse)}`);
      mmLog('CATCH_SPIRIT_FAIL', `${uid} error ${JSON.stringify(errorResponse)}`);
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
    
    logger.info(`CATCH_SPIRIT_SUCCESS ${uid} Character ${characterId} catch spirit ${spirit.id} ${spirit.name} in qr ${qrId}`);
    mmLog('CATCH_SPIRIT_SUCCESS', `${uid} Character ${characterId} catch spirit ${spirit.id} ${spirit.name} in qr ${qrId}`);

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
    logger.info(`CATCH_SPIRIT_FAIL ${uid} error ${JSON.stringify(errorResponse)}`);
    mmLog('CATCH_SPIRIT_FAIL', `${uid} error ${JSON.stringify(errorResponse)}`);
    return;
  }
}
