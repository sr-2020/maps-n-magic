import fetch from 'isomorphic-fetch';
import { 
  getQrModelData, 
  createLogger,
  validateQrModelData
} from 'sr2020-mm-server-event-engine';
import { 
  ErrorResponse, 
} from "sr2020-mm-event-engine";
import { Router } from 'express';

import { decode, playerServerCookie } from "../../utils";
import { catchSpirit2 } from './catchSpirit2';
import { freeSpirit } from './freeSpirit';

const logger = createLogger('player-server/spirits.ts');

logger.info('freeSpirit', freeSpirit)

const router = Router();

// this handler makes shallow check of qrId and spiritId and send request to server
router.post('/catchSpirit2', catchSpirit2);

router.post('/freeSpirit', freeSpirit);


// router.post('/catchSpirit', async (req, res, next) => {
//   const { body } = req;
//   if (!validateCatchSpiritRequestBody(body)) {
//     res.status(400).json(invalidRequestBody(body, validateCatchSpiritRequestBody.errors));
//     return;
//   }
//   const { qrId, spiritId } = body;
//   try {
//     const qrModelData = await putSpiritInStorage(Number(qrId), spiritId);

//     const errorResponse = validateQrModelData(qrModelData);

//     if (errorResponse !== null) {
//       res.status(500).json(errorResponse);
//       return;
//     }

//     res.status(200).json(qrModelData);
//   } catch (error) {
//     const message = `${error} ${JSON.stringify(error)}`;
//     logger.error(message, error);
//     const errorResponse: ErrorResponse = { 
//       errorTitle: 'Непредвиденная ошибка',
//       errorSubtitle: message 
//     };
//     res.status(500).json(errorResponse);
//   }
// });

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

    if ('errorTitle' in validationRes) {
      res.status(500).json(validationRes);
      return;
    }
    
    res.json(validationRes);
    
    // res.json({
    //   spiritJarQrString,
    //   qrData,
    //   qrModelData,
    //   date: new Date(),
    // });
  } catch (error) {
    const message = `${error} ${JSON.stringify(error)}`;
    logger.error(message, error);
    const errorResponse: ErrorResponse = { 
      errorTitle: 'Непредвиденная ошибка',
      errorSubtitle: message 
    };
    res.status(500).json(errorResponse);
  }
});


export const spiritRouter = router;
