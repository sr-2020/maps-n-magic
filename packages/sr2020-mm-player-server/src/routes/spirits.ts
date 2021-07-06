import fetch from 'isomorphic-fetch';
import { 
  catchSpirit, 
  freeSpirit, 
  getQrModelData, 
  validateCatchSpiritRequestBody, 
  validateCatchSpirit2RequestBody, 
  validateFreeSpiritRequestBody, 
  winstonLogger, 
  CharacterRequest,
  playerServerConstants,
  createLogger
} from 'sr2020-mm-server-event-engine';
import { 
  validateCommonQr, 
  validateSpiritJarQr, 
  ErrorResponse, 
  SpiritJarQr, 
  isEmptySpiritJar,
  isFullSpiritJar,
  GetSpirit
} from "sr2020-mm-event-engine";
import { Router } from 'express';

import { decode, playerServerCookie } from "../utils";

const logger = createLogger('spirits.ts');

const router = Router();

// this handler makes shallow check of qrId and spiritId and send request to server
router.post('/catchSpirit2', async (req1, res, next) => {
  // logger.info('/catchSpirit2');
  const req = req1 as CharacterRequest;
  const { body } = req;
  if (!validateCatchSpirit2RequestBody(body)) {
    const errorResponse: ErrorResponse = {
      errorTitle: 'Получены неправильные параметры запроса',
      errorSubtitle: `Тело запроса: ${JSON.stringify(body)}, ошибки валидации ${JSON.stringify(validateCatchSpirit2RequestBody.errors)}`
    };
    res.status(400).json(errorResponse);
    return;
  }
  const { spiritJarQrString, spiritId } = body;
  try {
    const qrData = decode(spiritJarQrString);
    const qrId = Number(qrData.payload);

    if (Number.isNaN(qrId)) {
      res.status(400).json(qrIdIsNanError(qrData.payload));
      return;
    }

    const qrModelData1 = await getQrModelData(qrId);

    const validationRes = validateQrModelData(qrModelData1);

    if ('errorResponse' in validationRes) {
      res.status(500).json(validationRes.errorResponse);
      return;
    }

    const { qrModelData } = validationRes;

    const spirit = req.gameModel.get2<GetSpirit>({
      type: 'spirit',
      id: Number(spiritId)
    });

    if (spirit === undefined) {
      const errorResponse: ErrorResponse = {
        errorTitle: 'Духа не найден',
        errorSubtitle: `Дух с id ${spiritId} не найден`
      };
      res.status(400).json(errorResponse);
      return;
    }

    // if (isFullSpiritJar(qrModelData)) {
    //   const { spiritId } = qrModelData.workModel.data;

    //   const spirit = req.gameModel.get2<GetSpirit>({
    //     type: 'spirit',
    //     id: Number(spiritId)
    //   });

    //   if (spirit === undefined) {
    //     // do nothing and proceed with catching
    //   } else {
    //     const { state } = spirit;
    //     if (state.status === 'InJar' && state.qrId === qrId) {
    //       const errorResponse: ErrorResponse = {
    //         errorTitle: 'Тотем содержит духа',
    //         errorSubtitle: `В тотеме уже находится дух ${spirit.name}`
    //       };
    //       res.status(400).json(errorResponse);
    //       return;
    //     }
    //   }
    // }

    const catchSpiritRes = await fetch(playerServerConstants().catchSpiritUrl, {
      method: 'POST',
      headers: {
        'Cookie': playerServerCookie,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        qrId,
        spiritId,
        characterId: req.userData.characterId
      })
    });

    const json = await catchSpiritRes.json();

    res.status(catchSpiritRes.status).json(json);
    // if()

    // const qrModelData = await catchSpirit(Number(qrId), spiritId);

    // const errorResponse = validateQrModelData(qrModelData);

    // if (errorResponse !== null) {
    //   res.status(500).json(errorResponse);
    //   return;
    // }

    // res.status(200).json(qrModelData);
    // res.status(200).json({status: 'success'});
  } catch (error) {
    const message = `${error} ${JSON.stringify(error)}`;
    winstonLogger.error(message, error);
    const errorResponse: ErrorResponse = { 
      errorTitle: 'Непредвиденная ошибка',
      errorSubtitle: message 
    };
    res.status(500).json(errorResponse);
  }
});

router.post('/catchSpirit', async (req, res, next) => {
  const { body } = req;
  if (!validateCatchSpiritRequestBody(body)) {
    const errorResponse: ErrorResponse = {
      errorTitle: 'Получены неправильные параметры запроса',
      errorSubtitle: `Тело запроса: ${JSON.stringify(body)}, ошибки валидации ${JSON.stringify(validateCatchSpiritRequestBody.errors)}`
    };
    res.status(400).json(errorResponse);
    return;
  }
  const { qrId, spiritId } = body;
  try {
    const qrModelData = await catchSpirit(Number(qrId), spiritId);

    const errorResponse = validateQrModelData(qrModelData);

    if (errorResponse !== null) {
      res.status(500).json(errorResponse);
      return;
    }

    res.status(200).json(qrModelData);
  } catch (error) {
    const message = `${error} ${JSON.stringify(error)}`;
    winstonLogger.error(message, error);
    const errorResponse: ErrorResponse = { 
      errorTitle: 'Непредвиденная ошибка',
      errorSubtitle: message 
    };
    res.status(500).json(errorResponse);
  }
});


router.post('/freeSpirit', async (req, res, next) => {
  const { body } = req;
  if (!validateFreeSpiritRequestBody(body)) {
    const errorResponse: ErrorResponse = {
      errorTitle: 'Получены неправильные параметры запроса',
      errorSubtitle: `Тело запроса: ${JSON.stringify(body)}, ошибки валидации ${JSON.stringify(validateFreeSpiritRequestBody.errors)}`
    };
    res.status(400).json(errorResponse);
    return;
  }
  const { qrId, reason } = body;
  try {
    const qrModelData = await freeSpirit(Number(qrId), reason);

    const errorResponse = validateQrModelData(qrModelData);

    if (errorResponse !== null) {
      res.status(500).json(errorResponse);
      return;
    }

    res.status(200).json(qrModelData);
  } catch (error) {
    const message = `${error} ${JSON.stringify(error)}`;
    winstonLogger.error(message, error);
    const errorResponse: ErrorResponse = { 
      errorTitle: 'Непредвиденная ошибка',
      errorSubtitle: message 
    };
    res.status(500).json(errorResponse);
  }
});

const qrIdIsNanError = (payload: string): ErrorResponse => ({
  errorTitle: 'Получен некорректный ответ от менеджера моделей',
  errorSubtitle: `QR id не число: ${payload}` 
});

router.use('/getSpiritDataByQr', async (req, res, next) => {
  const { spiritJarQrString } = req.query;
  if (typeof spiritJarQrString !== 'string') {
    const errorResponse: ErrorResponse = {
      errorTitle: 'Получен неправильный параметр запроса',
      errorSubtitle: `Данные QR не являются строкой: ${spiritJarQrString}`
    };
    res.status(400).json(errorResponse);
    return;
  }
  try {
    const qrData = decode(spiritJarQrString);
    const qrId = Number(qrData.payload);

    if (Number.isNaN(qrId)) {
      res.status(400).json(qrIdIsNanError(qrData.payload));
      return;
    }

    const qrModelData = await getQrModelData(qrId);
    // const qrModelData = await getQrModelData(qrId + 1000000);

    const validationRes = validateQrModelData(qrModelData);

    if ('errorResponse' in validationRes) {
      res.status(500).json(validationRes.errorResponse);
      return;
    }
    
    res.json(validationRes.qrModelData);
    
    // res.json({
    //   spiritJarQrString,
    //   qrData,
    //   qrModelData,
    //   date: new Date(),
    // });
  } catch (error) {
    const message = `${error} ${JSON.stringify(error)}`;
    winstonLogger.error(message, error);
    const errorResponse: ErrorResponse = { 
      errorTitle: 'Непредвиденная ошибка',
      errorSubtitle: message 
    };
    res.status(500).json(errorResponse);
  }
});

function validateQrModelData(qrModelData: unknown): 
  { errorResponse: ErrorResponse } | { qrModelData: SpiritJarQr} {
  if (!validateCommonQr(qrModelData)) {
    const message = `Данные QR не корректны. Данные модели ${JSON.stringify(qrModelData)}, ошибки валидации ${JSON.stringify(validateCommonQr.errors)}`;
    winstonLogger.error(message, validateCommonQr.errors);
    const errorResponse: ErrorResponse = {
      errorTitle: 'Получен некорректный ответ от менеджера моделей',
      errorSubtitle: message 
    };
    return { errorResponse };
  }

  if (!validateSpiritJarQr(qrModelData)) {
    let errorTitle = '';
    let errorSubtitle = '';
    if (qrModelData.workModel.type === 'spirit_jar') {
      errorTitle = 'Духохранилище некорректно';
      errorSubtitle = `Данные модели ${JSON.stringify(qrModelData)}, ошибки валидации ${JSON.stringify(validateSpiritJarQr.errors)}`;
    } else {
      errorTitle = 'QR не является духохранилищем';
      errorSubtitle = `Тип QR: ${qrModelData.workModel.type}`;
    }

    // const message = `. qrModelData ${JSON.stringify(qrModelData)}, validation errors ${JSON.stringify(validateSpiritJarQr.errors)}`;
    winstonLogger.error(errorSubtitle, validateSpiritJarQr.errors);
    const errorResponse: ErrorResponse = {
      errorTitle,
      errorSubtitle
    };
    return { errorResponse };
  }
  return { qrModelData };
}

export const spiritRouter = router;
