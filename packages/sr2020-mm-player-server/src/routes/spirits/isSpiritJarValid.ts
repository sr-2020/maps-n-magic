import { ErrorResponse, GetSpirit, isEmptySpiritJar, isFullBodyStorage, SpiritDataForQrValidation } from "sr2020-mm-event-engine";
import { createLogger, getQrModelData, PlayerAuthorizedRequest, validateBodyStorageQrModelData, validateSpiritJarQrModelData } from "sr2020-mm-server-event-engine";
import { decode } from "../../utils";

const logger = createLogger('isSpiritJarValid.ts');

const qrIdIsNanError = (payload: string): ErrorResponse => ({
  errorTitle: 'Получен некорректный ответ от менеджера моделей',
  errorSubtitle: `QR id не число: ${payload}` 
});

export const isSpiritJarValid = async (req1, res, next) => {
  const req = req1 as PlayerAuthorizedRequest;
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

    if (isEmptySpiritJar(validationRes)) {
      const errorResponse: ErrorResponse = { 
        errorTitle: 'Духохранилище пусто',
        errorSubtitle: '' 
      };
      res.status(400).json(errorResponse);
      return;
    }

    const { spiritId } = validationRes.workModel.data;

    const spirit = req.gameModel.get2<GetSpirit>({
      type:'spirit',
      id: Number(spiritId)
    });

    if (spirit === undefined) {
      const errorResponse: ErrorResponse = { 
        errorTitle: `Дух ${spiritId} не найден`,
        errorSubtitle: '' 
      };
      res.status(400).json(errorResponse);
      return;
    }

    const data: SpiritDataForQrValidation = {
      name: spirit.name,
      hitPoints: spirit.hitPoints,
      abilities: [],
    };
    
    res.json(data);
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