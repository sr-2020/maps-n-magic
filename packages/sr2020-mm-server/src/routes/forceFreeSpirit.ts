import { 
  ErrorResponse, 
} from "sr2020-mm-event-engine";
import { 
  createLogger, 
  freeSpiritFromStorage, 
  getQrModelData, 
  MainAuthorizedRequest, 
} from "sr2020-mm-server-event-engine";

const logger = createLogger('main/forceFreeSpirit.ts');

export const mainForceFreeSpirit = async (req1, res, next) => {
  const req = req1 as MainAuthorizedRequest;

  try {

    const qrId = Number(req.body.qrId);

    const qrModelData2 = await freeSpiritFromStorage(Number(qrId), '');

    res.status(200).json({});
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