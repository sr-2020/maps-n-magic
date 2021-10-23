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
import { 
  createLogger, 
  ExpectedQr, 
  GetQrModelData, 
  InnerApiRequest, 
  mmLog, 
  PutSpiritInStorage, 
  validateSpiritJarQrModelData 
} from 'sr2020-mm-server-event-engine';
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
  const req = req1 as InnerApiRequest;
  const { body, gameModel } = req;
  const uid = shortid.generate();
  try {
    // logger.info('putSpiritInJar')
    
    if (!validatePutSpiritInJarRequestBody(body)) {
      res.status(400).json(invalidRequestBody(body, validatePutSpiritInJarRequestBody.errors));
      return;
    }
    
    const { qrId, spiritType } = body;

    mmLog(gameModel, 'SPIRIT_SELL_ATTEMPT', `${uid} data ${JSON.stringify(body)}`);

    // 2. get qr model and check if it is SpiritJar
    const qrModelData1 = await gameModel.get2<GetQrModelData>({
      type: 'qrModelData',
      qrId,
      expectedQr: ExpectedQr.emptySpiritJar
    });

    const validationRes = validateSpiritJarQrModelData(qrModelData1);

    if ('errorTitle' in validationRes) {
      res.status(500).json(validationRes);
      mmLog(gameModel, 'SPIRIT_SELL_FAIL', `${uid} error ${JSON.stringify(validationRes)}`);
      return;
    }

    const qrModelData = validationRes;
    
    if (isFullSpiritJar(qrModelData)) {
      const errorResponse: ErrorResponse = {
        errorTitle: 'Тотем содержит духа',
        errorSubtitle: `В тотеме уже находится дух`
      };
      mmLog(gameModel, 'SPIRIT_SELL_FAIL', `${uid} error ${JSON.stringify(errorResponse)}`);
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

    const putResult = await gameModel.execute2<PutSpiritInStorage>({
      type: 'putSpiritInStorage',
      spiritStorageId: qrId,
      spiritId: spirit.id
    });
    logger.info(`SPIRIT_SELL_SUCCESS ${uid} ${spirit} ${putResult}`);

    mmLog(gameModel, 'SPIRIT_SELL_SUCCESS', `${uid} ${JSON.stringify(spirit)}`);

    res.status(200).json(spirit);
  } catch(error) {
    const message = `${error} ${JSON.stringify(error)}`;
    logger.error(message, error);
    const errorResponse: ErrorResponse = { 
      errorTitle: 'Непредвиденная ошибка',
      errorSubtitle: message 
    };
    res.status(500).json(errorResponse);
    mmLog(gameModel, 'SPIRIT_SELL_FAIL', `${uid} error ${JSON.stringify(errorResponse)}`);
    return;
  }
}