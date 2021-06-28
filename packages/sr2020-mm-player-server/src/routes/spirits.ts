import { validateCatchSpiritRequestBody, validateFreeSpiritRequestBody, winstonLogger } from 'sr2020-mm-server-event-engine';
import { validateCommonQr, validateSpiritJarQr, ErrorResponse } from "sr2020-mm-event-engine";
import { Router } from 'express';

import { decode } from "../utils";
import { getQrModelData, freeSpirit, catchSpirit } from "../api";

const router = Router();

router.post('/api/catchSpirit', async (req, res, next) => {
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


router.post('/api/freeSpirit', async (req, res, next) => {
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

router.use('/api/getSpiritDataByQr', async (req, res, next) => {
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
      const errorResponse: ErrorResponse = {
        errorTitle: 'Получен некорректный ответ от менеджера моделей',
        errorSubtitle: `QR id не число: ${qrData.payload}` 
      };
      res.status(400).json(errorResponse);
      return;
    }

    const qrModelData = await getQrModelData(qrId);
    // const qrModelData = await getQrModelData(qrId + 1000000);

    const errorResponse = validateQrModelData(qrModelData);

    if (errorResponse !== null) {
      res.status(500).json(errorResponse);
      return;
    }
  
    res.json(qrModelData);
    
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

function validateQrModelData(qrModelData: unknown): ErrorResponse | null {
  if (!validateCommonQr(qrModelData)) {
    const message = `Данные QR не корректны. Данные модели ${JSON.stringify(qrModelData)}, ошибки валидации ${JSON.stringify(validateCommonQr.errors)}`;
    winstonLogger.error(message, validateCommonQr.errors);
    const errorResponse: ErrorResponse = {
      errorTitle: 'Получен некорректный ответ от менеджера моделей',
      errorSubtitle: message 
    };
    return errorResponse;
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
    return errorResponse;
  }
  return null;
}

export const spiritRouter = router;
