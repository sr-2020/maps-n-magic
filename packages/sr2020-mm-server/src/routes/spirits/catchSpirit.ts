import * as R from 'ramda';
import { EPutSpiritRequested, ErrorResponse, GetSpirit, getSpiritLocationId, GetUserRecord, invalidRequestBody, isFullSpiritJar, validateCatchSpiritInternalRequest } from 'sr2020-mm-event-engine';
import { createLogger, getQrModelData, InnerApiRequest, putSpiritInStorage, validateQrModelData } from 'sr2020-mm-server-event-engine';

const logger = createLogger('catchSpirit.ts');

export const mainCatchSpirit = async (req1, res, next) => {
  try {
    logger.info('mainCatchSpirit')
    const req = req1 as InnerApiRequest;
    const { body } = req;

    if (!validateCatchSpiritInternalRequest(body)) {
      res.status(400).json(invalidRequestBody(body, validateCatchSpiritInternalRequest.errors));
      return;
    }

    const { characterId, qrId, spiritId } = body;

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
      return;
    }

    // 2. get qr model and check if it is SpiritJar
    const qrModelData1 = await getQrModelData(qrId);

    const validationRes = validateQrModelData(qrModelData1);

    if ('errorTitle' in validationRes) {
      res.status(500).json(validationRes);
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
      return;
    }

    const spiritLocationId = getSpiritLocationId(spirit);

    if (spiritLocationId == undefined) {
      const errorResponse: ErrorResponse = {
        errorTitle: 'Локация духа неизвестна',
        errorSubtitle: `Дух с id ${spiritId} в неизвестной локации`
      };
      res.status(400).json(errorResponse);
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
      res.status(400).json({
        status: 'fail',
        message: 'Попытка не удалась'
      });
      return;
    }

    if (isFullSpiritJar(qrModelData)) {
      const errorResponse: ErrorResponse = {
        errorTitle: 'Тотем содержит духа',
        errorSubtitle: `В тотеме уже находится дух`
      };
      res.status(400).json(errorResponse);
      return;
    }

    // action
    //   put spirit id in QR
    //   put new spirit state: InJar + qr id

    const putResult = await putSpiritInStorage(qrId, spiritId);
    logger.info('put spirit success confirmation', putResult);

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
    
    logger.info({
      status: 'success',
      message: 'Дух пойман'
    });

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
    return;
  }
}
