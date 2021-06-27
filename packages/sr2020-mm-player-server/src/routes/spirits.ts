import { winstonLogger } from 'sr2020-mm-server-event-engine';
import { validateCommonQr, validateSpiritJarQr, ErrorResponse } from "sr2020-mm-event-engine";
import { Router } from 'express';
import { decode } from "../utils";
import { getQrModelData } from "../api";

const router = Router();

router.use('/api/getSpiritDataByQr', async (req, res, next) => {
  const { spiritJarQrString } = req.query;
  if (typeof spiritJarQrString !== 'string') {
    const errorResponse: ErrorResponse = {
      errorTitle: 'Получен неправильный параметр запроса',
      errorSubtitle: `Данные QR не являются строкой. spiritJarQrString ${spiritJarQrString}`
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
        errorSubtitle: `QR id не число. qrData.payload ${qrData.payload}` 
      };
      res.status(400).json(errorResponse);
      return;
    }

    const qrModelData = await getQrModelData(qrId);
    // const qrModelData = await getQrModelData(qrId + 1000000);

    if (!validateCommonQr(qrModelData)) {
      const message = `Данные QR не корректны. qrModelData ${JSON.stringify(qrModelData)}, validation errors ${JSON.stringify(validateCommonQr.errors)}`;
      winstonLogger.error(message, validateCommonQr.errors);
      const errorResponse: ErrorResponse = {
        errorTitle: 'Получен некорректный ответ от менеджера моделей',
        errorSubtitle: message 
      };
      res.status(500).json(errorResponse);
      return;
    }

    if (!validateSpiritJarQr(qrModelData)) {
      let errorTitle = '';
      let errorSubtitle = '';
      if (qrModelData.workModel.type === 'spirit_jar') {
        errorTitle = 'Духохранилище некорректно';
        errorSubtitle = `qrModelData ${JSON.stringify(qrModelData)}, validation errors ${JSON.stringify(validateSpiritJarQr.errors)}`;
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
    const message = `getSpiritDataByQr. ${error} ${JSON.stringify(error)}`;
    winstonLogger.error(message, error);
    const errorResponse: ErrorResponse = { 
      errorTitle: 'Непредвиденная ошибка',
      errorSubtitle: message 
    };
    res.status(500).json(errorResponse);
  }
});

export const spiritRouter = router;
