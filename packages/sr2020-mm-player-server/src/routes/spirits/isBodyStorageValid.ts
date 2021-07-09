import { ErrorResponse, isFullBodyStorage } from "sr2020-mm-event-engine";
import { createLogger, getQrModelData, validateBodyStorageQrModelData, validateSpiritJarQrModelData } from "sr2020-mm-server-event-engine";
import { decode } from "../../utils";
import { qrIdIsNanError } from "./utils";

const logger = createLogger('isBodyStorageValid.ts');

export const isBodyStorageValid = async (req, res, next) => {
  const { bodyStorageQrString } = req.query;
  if (typeof bodyStorageQrString !== 'string') {
    const errorResponse: ErrorResponse = {
      errorTitle: 'Получен неправильный параметр запроса',
      errorSubtitle: `Данные QR не являются строкой: ${bodyStorageQrString}`
    };
    res.status(400).json(errorResponse);
    return;
  }
  try {
    const qrData = decode(bodyStorageQrString);
    const qrId = Number(qrData.payload);

    if (Number.isNaN(qrId)) {
      res.status(400).json(qrIdIsNanError(qrData.payload));
      return;
    }

    const qrModelData = await getQrModelData(qrId);
    // const qrModelData = await getQrModelData(qrId + 1000000);

    const validationRes = validateBodyStorageQrModelData(qrModelData);

    if ('errorTitle' in validationRes) {
      res.status(500).json(validationRes);
      return;
    }

    if (isFullBodyStorage(validationRes)) {
      const errorResponse: ErrorResponse = { 
        errorTitle: 'Телохранилище занято',
        errorSubtitle: '' 
      };
      res.status(400).json(errorResponse);
      return;
    }
    
    res.json(true);
  } catch (error) {
    const message = `${error} ${JSON.stringify(error)}`;
    logger.error(message, error);
    const errorResponse: ErrorResponse = { 
      errorTitle: 'Непредвиденная ошибка',
      errorSubtitle: message 
    };
    res.status(500).json(errorResponse);
  }
}