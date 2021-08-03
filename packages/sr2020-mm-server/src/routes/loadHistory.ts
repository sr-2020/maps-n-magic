import { 
  ErrorResponse, 
} from "sr2020-mm-event-engine";
import { 
  createLogger, 
  mmGetUserLog, 
  PlayerAuthorizedRequest, 
} from "sr2020-mm-server-event-engine";

const logger = createLogger('main/loadHistory.ts');

export const mainLoadHistory = async (req1, res, next) => {
  const req = req1 as PlayerAuthorizedRequest;

  try {
    const rows = await mmGetUserLog(Number(req.params.characterId));
    res.status(200).json(rows);
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