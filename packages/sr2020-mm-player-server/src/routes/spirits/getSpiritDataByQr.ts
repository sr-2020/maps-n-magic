import { ErrorResponse } from "sr2020-mm-event-engine";
import { createLogger, getQrModelData, validateSpiritJarQrModelData } from "sr2020-mm-server-event-engine";
import { decode } from "../../utils";

const logger = createLogger('getSpiritDataByQr.ts');

const qrIdIsNanError = (payload: string): ErrorResponse => ({
  errorTitle: 'Получен некорректный ответ от менеджера моделей',
  errorSubtitle: `QR id не число: ${payload}` 
});

export const getSpiritDataByQr = async (req, res, next) => {
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

    const validationRes = validateSpiritJarQrModelData(qrModelData);

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
}