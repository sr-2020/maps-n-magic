import * as R from 'ramda';
import { 
  ErrorResponse, 
  GetSpirit, 
  getSpiritLocationId, 
  GetUserRecord, 
  invalidRequestBody, 
  validateCatchSpiritInternalRequest,
  PutSpiritInJarRequestBody,
  validatePutSpiritInJarRequestBody,
  isFullSpiritJar,
  Spirit
} from 'sr2020-mm-event-engine';
import { createLogger, getQrModelData, InnerApiRequest, putSpiritInStorage, validateSpiritJarQrModelData } from 'sr2020-mm-server-event-engine';
import { NextFunction, Request, Response } from "express-serve-static-core";
import shortid from 'shortid';
import { postSpirit } from 'sr2020-mm-server-event-engine';

const logger = createLogger('putSpiritInJar.ts');

// Mr.Cellophane - Култук
// Fireball-keeper - Баргузин
// Tick-a-lick-a-boo - Сарма

// 2: "Баргузин",
// 3: "Култук",
// 4: "Сарма",

const fractionIndex: Record<string, number> = {
  "mr-cellophane": 3, 
  "fireball-keeper": 2,
  "tick-a-lick-a-boo": 4
};

export const putSpiritInJar = async (req1: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('putSpiritInJar')
    const req = req1 as InnerApiRequest;
    const { body } = req;

    
    if (!validatePutSpiritInJarRequestBody(body)) {
      res.status(400).json(invalidRequestBody(body, validatePutSpiritInJarRequestBody.errors));
      return;
    }
    
    const { qrId, spiritType } = body;

    // 2. get qr model and check if it is SpiritJar
    const qrModelData1 = await getQrModelData(qrId);

    const validationRes = validateSpiritJarQrModelData(qrModelData1);

    if ('errorTitle' in validationRes) {
      res.status(500).json(validationRes);
      return;
    }

    const qrModelData = validationRes;
    
    if (isFullSpiritJar(qrModelData)) {
      const errorResponse: ErrorResponse = {
        errorTitle: 'Тотем содержит духа',
        errorSubtitle: `В тотеме уже находится дух`
      };
      res.status(400).json(errorResponse);
      return;
    }

    const rawSpirit: Omit<Spirit, "id"> = {
      name: `${spiritType}-${shortid.generate()}`,
      abilities: [spiritType],
      hitPoints: 1,
      level: 1,
      story: '',
      timetable: [],
      state: {
        status: 'InJar',
        qrId
      },
      fraction: fractionIndex[spiritType]
    };

    const spirit = await postSpirit(rawSpirit);

    const putResult = await putSpiritInStorage(qrId, spirit.id);
    logger.info('put spirit success confirmation', putResult);

    res.status(200).json(spirit);
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