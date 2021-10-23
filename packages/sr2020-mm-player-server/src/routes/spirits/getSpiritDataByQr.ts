import * as R from 'ramda';
import { 
  ErrorResponse, 
  GameModel, 
  GetFeature, 
  GetSpirit, 
  GetSpiritFraction, 
  isFullSpiritJar, 
  Spirit 
} from "sr2020-mm-event-engine";
import { 
  createLogger, 
  GetQrModelData, 
  getSpiritWithFractionAbilities, 
  translateAbilities, 
  validateSpiritJarQrModelData 
} from "sr2020-mm-server-event-engine";
import { PlayerAuthorizedRequest } from '../../types';
import { decode } from "../../utils";
import { qrIdIsNanError } from "./utils";

const logger = createLogger('getSpiritDataByQr.ts');

export const getSpiritDataByQr = async (req1, res, next) => {
  const req = req1 as PlayerAuthorizedRequest;
  const { spiritJarQrString } = req.query;
  const { gameModel } = req;
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

    const qrModelData = await gameModel.get2<GetQrModelData>({
      type: 'qrModelData',
      qrId
    });

    const validationRes = validateSpiritJarQrModelData(qrModelData);

    if ('errorTitle' in validationRes) {
      res.status(500).json(validationRes);
      return;
    }

    let spirit: Spirit | undefined = undefined;
    if (isFullSpiritJar(validationRes)) {
      const { spiritId } = validationRes.workModel.data;
      spirit = req.gameModel.get2<GetSpirit>({
        type: 'spirit',
        id: Number(spiritId)
      });
      if (spirit !== undefined) {
        spirit = getSpiritWithFractionAbilities(req.gameModel, spirit);
        spirit.abilities = translateAbilities(req.gameModel, spirit.abilities);
      }
    }
    
    res.json({
      spiritJarQr: validationRes,
      spirit
    });
    
    // res.json({
    //   spiritJarQrString,
    //   qrData,
    //   qrModelData,
    //   date: new Date(),
    // });
  } catch (error) {
    const message = `${error} ${JSON.stringify(error)}`;
    const errorResponse: ErrorResponse = { 
      errorTitle: 'PS Непредвиденная ошибка получения данных о духе',
      errorSubtitle: message 
    };
    logger.error(errorResponse, error);
    res.status(500).json(errorResponse);
  }
}