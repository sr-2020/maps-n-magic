import { 
  ErrorResponse, 
} from "sr2020-mm-event-engine";
import { 
  createLogger, 
  FreeSpiritFromStorage, 
  MainAuthorizedRequest, 
} from "sr2020-mm-server-event-engine";

const logger = createLogger('main/forceFreeSpirit.ts');

export const mainForceFreeSpirit = async (req1, res, next) => {
  const req = req1 as MainAuthorizedRequest;
  const { gameModel } = req;

  try {

    const qrId = Number(req.body.qrId);

    await gameModel.execute2<FreeSpiritFromStorage>({
      type: 'freeSpiritFromStorage',
      spiritStorageId: Number(qrId),
      reason: ''
    });

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