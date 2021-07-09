import { ErrorResponse, GetSpirit, isEmptySpiritJar, isFullBodyStorage, isFullSpiritJar, SpiritDataForQrValidation } from "sr2020-mm-event-engine";
import { createLogger, getQrModelData, PlayerAuthorizedRequest, validateBodyStorageQrModelData, validateSpiritJarQrModelData } from "sr2020-mm-server-event-engine";
import { decode } from "../../utils";
import { qrIdIsNanError } from "./utils";

const logger = createLogger('isSpiritJarValid.ts');

export const isSpiritJarValid = async (req1, res, next) => {
  const req = req1 as PlayerAuthorizedRequest;
  const { spiritJarQrString, shouldBeEmpty } = req.query;
  if (typeof spiritJarQrString !== 'string' || 
    (shouldBeEmpty !== 'true' && shouldBeEmpty !== 'false')) {
    const errorResponse: ErrorResponse = {
      errorTitle: 'Получен неправильный параметр запроса',
      errorSubtitle: `Данные QR не являются строкой или shouldBeEmpty не правильный: ${spiritJarQrString}`
    };
    res.status(400).json(errorResponse);
    return;
  }

  const shouldBeEmpty2 = shouldBeEmpty === 'true';
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

    if (shouldBeEmpty2) {
      if (isFullSpiritJar(validationRes)) {
        const errorResponse: ErrorResponse = { 
          errorTitle: 'Духохранилище занято',
          errorSubtitle: '' 
        };
        res.status(400).json(errorResponse);
        return;
      }
      res.status(200).json(true);
    } else {
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
    }
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